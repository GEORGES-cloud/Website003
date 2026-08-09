"""PDF del cliente -> components/logo-paths.ts

Dependencias:  pip install pymupdf pillow numpy scipy vtracer

Dos representaciones distintas a propósito:

  * Flamenco, pico y ojo -> contornos rellenos. El trazo del original es
    variable (la cola y las plumas se afilan) y sólo el relleno lo conserva.
  * Línea de agua -> centerlines con stroke. Son hairlines de grosor uniforme;
    rellenar su contorno las hace desaparecer al reducir escala, porque el
    rasterizador colapsa los dos bordes del sliver.
"""
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
import vtracer, re, json, io, pathlib, tempfile, pymupdf

PDF = pathlib.Path(__file__).resolve().parent.parent / 'docs/brand/flamingo-logo.pdf'
CROP = (260, 50, 570, 310)   # flamenco + agua dentro del JPEG, sin el logotipo
TMP = pathlib.Path(tempfile.mkdtemp(prefix='flamingo-logo-'))  # intermedios del trazado


def source_image():
    """El PDF del cliente no lleva vectores: la página 1 es un JPEG de 798x563."""
    doc = pymupdf.open(PDF)
    xref = doc[0].get_images(full=True)[0][0]
    return Image.open(io.BytesIO(doc.extract_image(xref)['image'])).convert('RGB')
SPACE = 4.0            # unidades de salida por píxel del original
PAD = 6.0              # aire alrededor del arte, en unidades de salida

im = source_image().crop(CROP)
a = np.array(im).astype(float)
r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
cov = np.clip(1.0 - lum / 255.0, 0, 1)
is_pink = np.clip((r - g) / 255.0, 0, 1) > 0.10

TOK = re.compile(r'([MLCZ])|(-?\d*\.?\d+)')


def trace_fills(mask, up, blur, speckle, tag):
    ink = np.clip((mask - 0.18) / (0.62 - 0.18), 0, 1)
    img = Image.fromarray(((1 - ink) * 255).astype(np.uint8), 'L')
    img = img.resize((img.width * up, img.height * up), Image.LANCZOS)
    img = img.filter(ImageFilter.GaussianBlur(up * blur))
    img.convert('RGB').save(TMP / f'{tag}.png')
    vtracer.convert_image_to_svg_py(
        str(TMP / f'{tag}.png'), str(TMP / f'{tag}.svg'), colormode='binary', mode='spline',
        filter_speckle=speckle, corner_threshold=80,
        length_threshold=8.0, splice_threshold=60, path_precision=2)

    k = SPACE / up
    shapes = []
    for el in re.findall(r'<path\b[^>]*/?>', (TMP / f'{tag}.svg').read_text()):
        d = re.search(r'\sd="([^"]*)"', el)
        t = re.search(r'translate\(([-\d.]+),([-\d.]+)\)', el)
        if not d:
            continue
        tx, ty = (float(t.group(1)) * k, float(t.group(2)) * k) if t else (0.0, 0.0)
        seq, cmd, nums = [], None, []
        for c, n in TOK.findall(d.group(1)):
            if c:
                if cmd:
                    seq.append((cmd, nums))
                cmd, nums = c, []
            else:
                nums.append(float(n))
        if cmd:
            seq.append((cmd, nums))
        shapes.append([(c, [(nums[i] * k + tx, nums[i + 1] * k + ty)
                            for i in range(0, len(nums) - 1, 2)]) for c, nums in seq])
    return shapes


def emit_fill(shape, ox, oy):
    """Coordenadas absolutas: los deltas relativos redondeados degradan los
    trazos finos hasta hacerlos desaparecer."""
    def f(v):
        return f'{round(v, 1):g}'
    parts = []
    for cmd, pts in shape:
        if cmd == 'Z':
            parts.append('Z')
            continue
        pts = [(x - ox, y - oy) for x, y in pts]
        if cmd == 'M':
            parts.append(f'M{f(pts[0][0])} {f(pts[0][1])}')
            pts = pts[1:]
            if pts:
                parts.append('L' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts))
        elif cmd == 'L':
            parts.append('L' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts))
        elif cmd == 'C':
            for k in range(0, len(pts) - 2, 3):
                parts.append('C' + ' '.join(f'{f(x)} {f(y)}' for x, y in pts[k:k + 3]))
    return ''.join(parts).replace(' -', '-').replace('L-', 'L -').replace('C-', 'C -')


# ---------- flamenco (rosa) ----------
pink_shapes = trace_fills(np.where(is_pink, cov, 0.0), 3, 0.55, 6, 'o_pink')

# ---------- pico y ojo (tinta) : sólo los componentes compactos ----------
dark_shapes = trace_fills(np.where(~is_pink, cov, 0.0), 4, 0.28, 4, 'o_dark')
detail = []
for sh in dark_shapes:
    pts = [p for _, ps in sh for p in ps]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    if w < h * 2.5 or w < 25 * SPACE:      # compacto -> pico / ojo
        detail.append(sh)
print(f'flamenco: {len(pink_shapes)} contornos | detalle tinta: {len(detail)}')

# ---------- agua (centerlines) ----------
darkmask = (~is_pink) & (cov > 0.30)
lab, n = ndimage.label(darkmask, structure=np.ones((3, 3)))


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    p0, p1 = np.array(pts[0]), np.array(pts[-1])
    d = p1 - p0
    L = float(np.hypot(d[0], d[1]))
    if L == 0:
        return [pts[0], pts[-1]]
    P = np.array(pts)
    dist = np.abs(d[0] * (P[:, 1] - p0[1]) - d[1] * (P[:, 0] - p0[0])) / L
    k = int(dist.argmax())
    if dist[k] > eps:
        return rdp(pts[:k + 1], eps)[:-1] + rdp(pts[k:], eps)
    return [pts[0], pts[-1]]


def smooth_path(pts):
    P = [pts[0]] + list(pts) + [pts[-1]]
    out = [f'M{pts[0][0]:.1f} {pts[0][1]:.1f}']
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        out.append(f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}')
    return ''.join(out).replace(' -', '-').replace('C-', 'C -')


waves, thick = [], []
for i in range(1, n + 1):
    ys, xs = np.nonzero(lab == i)
    w, h = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
    if not (w >= 25 and w > h * 2.5):
        continue
    comp = lab == i
    centers = [(float(x), float(np.nonzero(comp[:, x])[0].mean()))
               for x in range(xs.min(), xs.max() + 1) if comp[:, x].any()]
    thick.append(len(xs) / len(centers))
    waves.append([(x * SPACE, y * SPACE) for x, y in rdp(centers, 0.22)])
waves.sort(key=lambda p: p[0][0])
stroke = float(np.mean(thick)) * SPACE
print(f'agua: {len(waves)} ondas, stroke {stroke:.2f}')

# ---------- encuadre común ----------
fill_pts = [p for sh in pink_shapes + detail for _, ps in sh for p in ps]
wave_pts = [p for wv in waves for p in wv]
allpts = fill_pts + wave_pts
minx, miny = min(x for x, _ in allpts), min(y for _, y in allpts)
maxx = max(x for x, _ in allpts)
maxy = max(y for _, y in allpts)
ox, oy = minx - PAD, miny - PAD - stroke / 2
W = round(maxx - minx + 2 * PAD, 1)
H = round(maxy - miny + 2 * PAD + stroke, 1)

bird = [p for sh in pink_shapes + detail for _, ps in sh for p in ps]
bx0, by0 = min(x for x, _ in bird) - ox - PAD, min(y for _, y in bird) - oy - PAD
bw = max(x for x, _ in bird) - min(x for x, _ in bird) + 2 * PAD
bh = max(y for _, y in bird) - min(y for _, y in bird) + 2 * PAD

out = {
    'viewBox': f'0 0 {W:g} {H:g}',
    'birdViewBox': f'{round(bx0,1):g} {round(by0,1):g} {round(bw,1):g} {round(bh,1):g}',
    'flamingo': [emit_fill(sh, ox, oy) for sh in pink_shapes],
    'detail': [emit_fill(sh, ox, oy) for sh in detail],
    'waves': [smooth_path([(x - ox, y - oy) for x, y in wv]) for wv in waves],
    'waveStroke': round(stroke, 1),
}
tot = sum(len(p) for p in out['flamingo'] + out['detail'] + out['waves'])
print(f"viewBox {out['viewBox']} | bird {out['birdViewBox']} | {tot} bytes de path")


# ---------- salida: components/logo-paths.ts ----------
HEADER = '''/**
 * Geometría de la marca — GENERADO, no editar a mano.
 *
 * Fuente: docs/brand/flamingo-logo.pdf, entregado por el cliente.
 * Regenerar con: python3 scripts/build-logo.py
 *
 * OJO: ese PDF no lleva vectores, sólo un JPEG incrustado de 798x563. Esta
 * geometría es un autotrazado de ese raster, no el original vectorial. Si algún
 * día llega el .ai/.eps/.svg de verdad, sustituir este archivo por sus paths.
 *
 * El flamenco va como contorno relleno porque su trazo es variable —la cola y
 * las plumas se afilan— y sólo el relleno lo conserva. La línea de agua va como
 * centerline con stroke: son hairlines de grosor constante, y rellenar su
 * contorno las hace desaparecer al reducir escala porque el rasterizador junta
 * los dos bordes del sliver.
 */

'''

ts = [HEADER]
ts.append('/** Caja del conjunto: flamenco + línea de agua. */\n')
ts.append(f"export const FULL_VIEWBOX = '{out['viewBox']}';\n\n")
ts.append('/** Caja del flamenco solo, para las variantes sin agua. */\n')
ts.append(f"export const BIRD_VIEWBOX = '{out['birdViewBox']}';\n\n")
ts.append('/** Contornos del flamenco — se rellenan con el color de marca. */\n')
ts.append('export const FLAMINGO_PATHS: readonly string[] = [\n')
ts += [f"  '{d}',\n" for d in out['flamingo']]
ts.append('];\n\n')
ts.append('/** Pico y ojo — se rellenan en tinta (currentColor). */\n')
ts.append('export const DETAIL_PATHS: readonly string[] = [\n')
ts += [f"  '{d}',\n" for d in out['detail']]
ts.append('];\n\n')
ts.append('/** Línea de agua — centerlines, se trazan con WAVE_STROKE. */\n')
ts.append('export const WAVE_PATHS: readonly string[] = [\n')
ts += [f"  '{d}',\n" for d in out['waves']]
ts.append('];\n\n')
ts.append(f"export const WAVE_STROKE = {out['waveStroke']};\n")

open(pathlib.Path(__file__).resolve().parent.parent / 'components/logo-paths.ts', 'w').write(''.join(ts))
print('escrito logo-paths.ts', len(''.join(ts)), 'bytes')
