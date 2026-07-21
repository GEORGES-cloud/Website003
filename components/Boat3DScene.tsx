'use client';

/**
 * Boat3DScene — el visor WebGL (React Three Fiber).
 * La cámara ORBITA el barco en función del progreso de scroll (0 → 1) y el
 * barco "flota" con un balanceo sutil. Cuando la sección sale de pantalla,
 * el bucle de render se pausa (prop `active`) para no gastar GPU.
 *
 * El barco es una RECREACIÓN PROCEDIMENTAL de la Sea Ray SPX 210 del club,
 * modelada a partir de sus fotos reales (public/images/searay-*.jpg).
 * El casco NO es una extrusión: es una malla LOFTEADA a partir de cuadernas
 * (secciones quilla→pantoque→brusca→regala) con fondo en V, arrufo que sube
 * a proa y abanico en la amura — como un casco de verdad. El fileteado rojo
 * recorre la regala con un tubo sobre una curva Catmull-Rom, y un entorno de
 * estudio propio (sin peticiones externas) da reflejos de gelcoat. En popa
 * cuelga un fueraborda Mercury FourStroke 200 ("Blue" es la versión OB).
 *
 * 🔁 SI ALGÚN DÍA HAY UN .glb ESCANEADO/FIEL (ver docs/guia-modelo-3d-barco.md):
 *   1. Colócalo en public/models/searay-spx-210.glb
 *   2. Arriba: import { useGLTF } from '@react-three/drei';
 *   3. Sustituye <SeaRaySpx210 /> por:
 *        function Boat() {
 *          const { scene } = useGLTF('/models/searay-spx-210.glb');
 *          return <primitive object={scene} />;
 *        }
 *        useGLTF.preload('/models/searay-spx-210.glb');
 *   4. Ajusta escala/posición (este modelo mide ~6,6 unidades de eslora,
 *      centrado en el origen, con la proa hacia +X).
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

/** Mueve la cámara alrededor del barco según el scroll (con amortiguación). */
function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree();
  const eased = useRef(0);

  useFrame((_, dt) => {
    const target = Math.min(1, Math.max(0, progress.get()));
    // Amortiguación: la cámara persigue suavemente el objetivo del scroll.
    eased.current = THREE.MathUtils.damp(eased.current, target, 5, dt);
    const p = eased.current;

    const angle = THREE.MathUtils.lerp(-2.35, 2.25, p); // barrido orbital ~±130°
    const radius = 9.6 - Math.sin(p * Math.PI) * 2.6; // se acerca en el clímax central
    const height = 2.9 - p * 1.0; // desciende suavemente hacia el final

    camera.position.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    camera.lookAt(0, 0.85, 0);
  });

  return null;
}

/** Balanceo de fondeo: el barco "flota" aunque no muevas el scroll. */
function FloatingGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!group.current) return;
    group.current.position.y = Math.sin(t * 0.7) * 0.045;
    group.current.rotation.z = Math.sin(t * 0.5) * 0.02; // balance (roll)
    group.current.rotation.x = Math.cos(t * 0.4) * 0.012; // cabeceo (pitch)
  });
  return <group ref={group}>{children}</group>;
}

// Materiales de la SPX real (tomados de las fotos del club)
const NAVY = { color: '#16264d', metalness: 0.4, roughness: 0.22, envMapIntensity: 1.0 } as const;
const RED_STRIPE = { color: '#a83430', metalness: 0.35, roughness: 0.3, envMapIntensity: 0.8 } as const;
const DECK_WHITE = { color: '#f1eee6', metalness: 0.08, roughness: 0.4, envMapIntensity: 0.5 } as const;
const CUSHION = { color: '#eae7de', roughness: 0.9, envMapIntensity: 0.25 } as const;
const EVA_GRAY = { color: '#83868a', roughness: 0.95 } as const;
const DARK_TRIM = { color: '#2b2d33', metalness: 0.15, roughness: 0.55, envMapIntensity: 0.4 } as const;
const TOWER_BLACK = { color: '#17181c', metalness: 0.55, roughness: 0.38, envMapIntensity: 0.7 } as const;
const GLASS = { color: '#1e2f3a', metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.45, envMapIntensity: 1.2 } as const;
const CHROME = { color: '#cdd2d7', metalness: 0.95, roughness: 0.12, envMapIntensity: 1.3 } as const;

/**
 * Cuadernas del casco (media sección → espejada a babor):
 * x = posición longitudinal (proa +X) · ys/w = regala (altura/semimanga)
 * yc/wc = brusca (chine) · yk = quilla. Perfil SLEEK de bowrider (leído de las
 * fotos de la SPX 210): francobordo bajo, popa baja, arrufo suave que sube a
 * proa, entrada FINA y roda LANZADA (bow tip volado a +X), fondo en V.
 */
const STATIONS = [
  { x: -3.3, ys: 0.86, w: 1.02, yc: 0.4, wc: 0.94, yk: 0.34 },
  { x: -2.55, ys: 0.85, w: 1.15, yc: 0.3, wc: 1.05, yk: 0.13 },
  { x: -1.65, ys: 0.86, w: 1.26, yc: 0.24, wc: 1.13, yk: 0.04 },
  { x: -0.6, ys: 0.9, w: 1.29, yc: 0.23, wc: 1.14, yk: 0.02 },
  { x: 0.4, ys: 0.96, w: 1.25, yc: 0.27, wc: 1.06, yk: 0.05 },
  { x: 1.3, ys: 1.02, w: 1.1, yc: 0.35, wc: 0.86, yk: 0.14 },
  { x: 2.1, ys: 1.08, w: 0.82, yc: 0.48, wc: 0.56, yk: 0.34 },
  { x: 2.78, ys: 1.13, w: 0.46, yc: 0.7, wc: 0.28, yk: 0.66 },
  { x: 3.24, ys: 1.19, w: 0.16, yc: 0.98, wc: 0.08, yk: 1.0 },
  { x: 3.46, ys: 1.22, w: 0.02, yc: 1.12, wc: 0.015, yk: 1.18 },
] as const;

const RING = 7; // puntos por cuaderna: regala+ · brusca+ · pantoque+ · quilla · pantoque− · brusca− · regala−

/** Altura de la regala (deck line) interpolada en cualquier x → anclar muebles. */
function deckY(x: number): number {
  const S = STATIONS;
  if (x <= S[0].x) return S[0].ys;
  for (let i = 0; i < S.length - 1; i++) {
    if (x >= S[i].x && x <= S[i + 1].x) {
      const t = (x - S[i].x) / (S[i + 1].x - S[i].x);
      return S[i].ys + (S[i + 1].ys - S[i].ys) * t;
    }
  }
  return S[S.length - 1].ys;
}

function buildHullGeometries() {
  const N = STATIONS.length;
  const pos: number[] = [];

  // Anillo de cada cuaderna (recorre la sección de babor a estribor por la quilla)
  for (const s of STATIONS) {
    const ym = s.yk + (s.yc - s.yk) * 0.35; // pantoque bajo (suaviza la V)
    const zm = s.wc * 0.55;
    pos.push(s.x, s.ys, +s.w);
    pos.push(s.x, s.yc, +s.wc);
    pos.push(s.x, ym, +zm);
    pos.push(s.x, s.yk, 0);
    pos.push(s.x, ym, -zm);
    pos.push(s.x, s.yc, -s.wc);
    pos.push(s.x, s.ys, -s.w);
  }

  const idx: number[] = [];
  // Lofting entre cuadernas consecutivas (normales hacia fuera)
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < RING - 1; j++) {
      const a = i * RING + j;
      const b = a + 1;
      const c = (i + 1) * RING + j + 1;
      const d = (i + 1) * RING + j;
      idx.push(a, b, c, a, c, d);
    }
  }

  // Espejo de popa (abanico desde el centroide, normal hacia -X)
  const s0 = STATIONS[0];
  const cAft = pos.length / 3;
  pos.push(s0.x, (s0.yk + s0.ys) / 2, 0);
  for (let j = 0; j < RING - 1; j++) idx.push(cAft, j + 1, j);

  // Roda (cierre mínimo de proa, normal hacia +X)
  const sN = STATIONS[N - 1];
  const cFwd = pos.length / 3;
  pos.push(sN.x, (sN.yk + sN.ys) / 2, 0);
  const last = (N - 1) * RING;
  for (let j = 0; j < RING - 1; j++) idx.push(cFwd, last + j, last + j + 1);

  const hull = new THREE.BufferGeometry();
  hull.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  hull.setIndex(idx);
  hull.computeVertexNormals();

  // Cubierta: tapa con brusca (bombeo central) que sigue la curva del arrufo
  const dPos: number[] = [];
  const dIdx: number[] = [];
  for (const s of STATIONS) {
    dPos.push(s.x, s.ys + 0.004, +s.w * 0.965);
    dPos.push(s.x, s.ys + 0.035, 0);
    dPos.push(s.x, s.ys + 0.004, -s.w * 0.965);
  }
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < 2; j++) {
      const a = i * 3 + j;
      const b = a + 1;
      const c = (i + 1) * 3 + j + 1;
      const d = (i + 1) * 3 + j;
      dIdx.push(a, c, b, a, d, c); // winding invertido → normales hacia +Y
    }
  }
  const deck = new THREE.BufferGeometry();
  deck.setAttribute('position', new THREE.Float32BufferAttribute(dPos, 3));
  deck.setIndex(dIdx);
  deck.computeVertexNormals();

  // Fileteado rojo: tubo sobre la línea de regala (ambas bandas, lazo cerrado)
  const sheer: THREE.Vector3[] = [];
  for (const s of STATIONS) sheer.push(new THREE.Vector3(s.x, s.ys - 0.02, +(s.w + 0.006)));
  for (let i = N - 1; i >= 0; i--) {
    const s = STATIONS[i];
    sheer.push(new THREE.Vector3(s.x, s.ys - 0.02, -(s.w + 0.006)));
  }
  const stripeCurve = new THREE.CatmullRomCurve3(sheer, true, 'catmullrom', 0.1);
  const stripe = new THREE.TubeGeometry(stripeCurve, 260, 0.014, 8, true);

  return { hull, deck, stripe };
}

/**
 * Fueraborda Mercury FourStroke 200 (V6) — colgado del espejo de popa.
 * Capó negro con banda cromada y panel claro (guiño al decal FourStroke),
 * tronco, placa antiventilación y cola con hélice de tres palas. El grupo
 * cuelga de la regala (deckY) y rakea ligeramente hacia popa.
 */
function MercuryOutboard200() {
  return (
    <group position={[-3.32, deckY(-3.3), 0]} rotation={[0, 0, 0.07]}>
      {/* Abrazadera al espejo */}
      <mesh position={[-0.05, -0.08, 0]}>
        <boxGeometry args={[0.18, 0.32, 0.26]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      {/* Capó negro brillante */}
      <RoundedBox args={[0.5, 0.52, 0.36]} radius={0.09} smoothness={4} position={[-0.34, 0.2, 0]}>
        <meshStandardMaterial {...TOWER_BLACK} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.09, 0.28]} radius={0.035} smoothness={4} position={[-0.32, 0.48, 0]}>
        <meshStandardMaterial {...TOWER_BLACK} />
      </RoundedBox>
      {/* Banda cromada inferior + paneles laterales claros */}
      <mesh position={[-0.34, -0.08, 0]}>
        <boxGeometry args={[0.52, 0.05, 0.38]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {([1, -1] as const).map((s) => (
        <mesh key={s} position={[-0.34, 0.22, s * 0.185]}>
          <boxGeometry args={[0.28, 0.15, 0.012]} />
          <meshStandardMaterial {...DECK_WHITE} />
        </mesh>
      ))}
      {/* Tronco hasta la placa antiventilación */}
      <mesh position={[-0.32, -0.4, 0]}>
        <boxGeometry args={[0.19, 0.6, 0.15]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[-0.32, -0.7, 0]}>
        <boxGeometry args={[0.34, 0.02, 0.2]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      {/* Cola: aleta, torpedo y cono de proa */}
      <mesh position={[-0.32, -0.78, 0]}>
        <boxGeometry args={[0.14, 0.16, 0.055]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[-0.32, -0.84, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.048, 0.048, 0.3, 12]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[-0.14, -0.84, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.048, 0.1, 12]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      {/* Hélice de tres palas + buje cromados */}
      <mesh position={[-0.51, -0.84, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.09, 10]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {([0, (2 * Math.PI) / 3, (4 * Math.PI) / 3] as const).map((a) => (
        <group key={a} position={[-0.49, -0.84, 0]} rotation={[a, 0, 0]}>
          <mesh position={[0, 0.07, 0]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.018, 0.12, 0.07]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Recreación procedimental de la Sea Ray SPX 210 (ver cabecera). */
function SeaRaySpx210() {
  const { hull, deck, stripe } = useMemo(buildHullGeometries, []);

  return (
    <group>
      {/* ── Casco lofteado, cubierta con arrufo y fileteado ─────────── */}
      <mesh geometry={hull} castShadow>
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh geometry={deck}>
        <meshStandardMaterial {...DECK_WHITE} />
      </mesh>
      <mesh geometry={stripe}>
        <meshStandardMaterial {...RED_STRIPE} />
      </mesh>

      {/* ── Proa abierta (bowrider): asientos en V + solárium ───────── */}
      <RoundedBox args={[1.5, 0.13, 0.4]} radius={0.05} smoothness={4} position={[1.75, 1.0, 0.42]} rotation={[0, 0.26, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.13, 0.4]} radius={0.05} smoothness={4} position={[1.75, 1.0, -0.42]} rotation={[0, -0.26, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[1.15, 0.1, 0.62]} radius={0.05} smoothness={4} position={[1.95, 0.99, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.12, 0.36]} radius={0.04} smoothness={4} position={[2.5, 1.06, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>

      {/* ── Parabrisas envolvente walk-through (marco oscuro + cristal) ─ */}
      <mesh position={[0.85, 1.2, 0.34]} rotation={[0, -0.28, -0.32]}>
        <boxGeometry args={[0.04, 0.44, 0.55]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.85, 1.2, -0.34]} rotation={[0, 0.28, -0.32]}>
        <boxGeometry args={[0.04, 0.44, 0.55]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.36, 1.18, 0.78]} rotation={[0, 0.6, -0.24]}>
        <boxGeometry args={[0.8, 0.4, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.36, 1.18, -0.78]} rotation={[0, -0.6, -0.24]}>
        <boxGeometry args={[0.8, 0.4, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      {/* Marco superior (moldura negra) */}
      <mesh position={[0.78, 1.42, 0.5]} rotation={[0, -0.28, -0.32]}>
        <boxGeometry args={[0.05, 0.05, 0.62]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.78, 1.42, -0.5]} rotation={[0, 0.28, -0.32]}>
        <boxGeometry args={[0.05, 0.05, 0.62]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>

      {/* ── Puesto de mando (estribor) + asientos bucket ─────────────── */}
      <mesh position={[0.42, 0.92, -0.5]}>
        <boxGeometry args={[0.5, 0.62, 0.6]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.54, 1.2, -0.5]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.26, 0.07, 0.56]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.24, 1.13, -0.5]} rotation={[0, Math.PI / 2, 0.2]}>
        <torusGeometry args={[0.12, 0.018, 10, 28]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {([-0.5, 0.5] as const).map((z) => (
        <group key={z} position={[-0.45, 0, z]}>
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.24, 10]} />
            <meshStandardMaterial {...DARK_TRIM} />
          </mesh>
          <RoundedBox args={[0.44, 0.12, 0.44]} radius={0.04} smoothness={4} position={[0, 0.9, 0]}>
            <meshStandardMaterial {...CUSHION} />
          </RoundedBox>
          <RoundedBox args={[0.12, 0.44, 0.42]} radius={0.04} smoothness={4} position={[-0.2, 1.14, 0]} rotation={[0, 0, 0.16]}>
            <meshStandardMaterial {...CUSHION} />
          </RoundedBox>
        </group>
      ))}

      {/* ── Bañera: suelo EVA gris (recogido) + banco en L a babor ───── */}
      <mesh position={[-1.05, 0.62, 0]}>
        <boxGeometry args={[2.5, 0.05, 1.4]} />
        <meshStandardMaterial {...EVA_GRAY} />
      </mesh>
      <RoundedBox args={[1.7, 0.26, 0.4]} radius={0.05} smoothness={4} position={[-1.4, 0.86, 0.62]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[1.7, 0.28, 0.1]} radius={0.04} smoothness={4} position={[-1.4, 1.08, 0.82]} rotation={[-0.16, 0, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>

      {/* ── Popa: solárium + plataformas de baño partidas (layout OB) ── */}
      <RoundedBox args={[0.9, 0.15, 1.7]} radius={0.05} smoothness={4} position={[-2.7, 0.88, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.08, 1.55]} radius={0.04} smoothness={4} position={[-2.34, 0.98, 0]} rotation={[0, 0, -0.32]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      {/* Dos medias plataformas flanqueando el motor, como en la SPX 210 OB */}
      {([1, -1] as const).map((s) => (
        <group key={s}>
          <mesh position={[-3.56, 0.6, s * 0.52]}>
            <boxGeometry args={[0.5, 0.07, 0.58]} />
            <meshStandardMaterial {...DECK_WHITE} />
          </mesh>
          <mesh position={[-3.56, 0.645, s * 0.52]}>
            <boxGeometry args={[0.4, 0.02, 0.46]} />
            <meshStandardMaterial {...EVA_GRAY} />
          </mesh>
        </group>
      ))}
      <MercuryOutboard200 />

      {/* ── Torre de wake NEGRA (baja, reforzada, A-frame) con tabla ── */}
      <group>
        {/* Patas delanteras (casi verticales, abren hacia fuera) */}
        <mesh position={[-0.35, 1.5, 0.72]} rotation={[0.12, 0, 0.28]}>
          <cylinderGeometry args={[0.055, 0.06, 1.25, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.35, 1.5, -0.72]} rotation={[-0.12, 0, 0.28]}>
          <cylinderGeometry args={[0.055, 0.06, 1.25, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Patas traseras (rakean hacia delante para juntarse arriba) */}
        <mesh position={[-0.95, 1.5, 0.7]} rotation={[0.12, 0, -0.42]}>
          <cylinderGeometry args={[0.055, 0.06, 1.3, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.95, 1.5, -0.7]} rotation={[-0.12, 0, -0.42]}>
          <cylinderGeometry args={[0.055, 0.06, 1.3, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Largueros superiores + travesaño */}
        <mesh position={[-0.6, 2.06, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.6, 2.06, -0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.6, 2.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.1, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Rack lateral + tabla de wake (roja, como en las fotos) */}
        <mesh position={[-0.6, 2.06, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
        <RoundedBox args={[0.9, 0.05, 0.24]} radius={0.02} smoothness={4} position={[-0.6, 2.06, 0.92]} rotation={[0, 0, 0.1]}>
          <meshStandardMaterial color="#8e2b26" metalness={0.3} roughness={0.35} envMapIntensity={0.8} />
        </RoundedBox>
      </group>

      {/* ── Detalles: cornamusas cromadas y luz de proa ─────────────── */}
      {([1, -1] as const).map((s) => (
        <group key={s}>
          <mesh position={[2.1, 1.0, s * 0.72]}>
            <boxGeometry args={[0.18, 0.04, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[-2.95, 0.86, s * 0.95]}>
            <boxGeometry args={[0.18, 0.04, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        </group>
      ))}
      <mesh position={[3.28, 1.16, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

export default function Boat3DScene({
  progress,
  active = true,
}: {
  progress: MotionValue<number>;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 2.9, 9.6], fov: 42 }}
      frameloop={active ? 'always' : 'never'}
      style={{ pointerEvents: 'none' }}
    >
      {/* Iluminación de estudio */}
      <hemisphereLight args={['#dbeaff', '#c9c2b4', 0.9]} />
      <directionalLight position={[6, 9, 5]} intensity={1.5} />
      <directionalLight position={[-7, 4, -5]} intensity={0.45} color="#9fb8d6" />
      <spotLight position={[0, 8, 0]} angle={0.6} penumbra={1} intensity={0.35} />

      {/* Entorno de estudio PROPIO (softboxes) → reflejos de gelcoat, sin red */}
      <Environment resolution={256} frames={1}>
        <mesh scale={60}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#dfe6ec" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 10]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-12, 6, 8]} rotation={[0, 1, 0]}>
          <planeGeometry args={[14, 8]} />
          <meshBasicMaterial color="#f6f7f8" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[10, 5, -9]} rotation={[0, -0.9, 0]}>
          <planeGeometry args={[12, 6]} />
          <meshBasicMaterial color="#eef1f4" side={THREE.DoubleSide} />
        </mesh>
      </Environment>

      <FloatingGroup>
        <SeaRaySpx210 />
      </FloatingGroup>

      {/* Sombra de contacto suave — ancla el barco al "suelo" del estudio */}
      <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={22} blur={2.6} far={7} resolution={512} color="#1A1916" />

      <CameraRig progress={progress} />
    </Canvas>
  );
}
