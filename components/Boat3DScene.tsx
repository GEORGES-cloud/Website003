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
 * estudio propio (sin peticiones externas) da reflejos de gelcoat.
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
 * yc/wc = brusca (chine) · yk = quilla. Valores leídos de las fotos:
 * arrufo ascendente a proa, V de fondo, abanico en la amura, espejo curvo.
 */
const STATIONS = [
  { x: -3.3, ys: 1.0, w: 1.02, yc: 0.34, wc: 0.9, yk: 0.16 },
  { x: -2.6, ys: 0.99, w: 1.13, yc: 0.28, wc: 1.0, yk: 0.09 },
  { x: -1.7, ys: 0.99, w: 1.23, yc: 0.25, wc: 1.08, yk: 0.05 },
  { x: -0.7, ys: 1.0, w: 1.28, yc: 0.25, wc: 1.1, yk: 0.04 },
  { x: 0.3, ys: 1.03, w: 1.25, yc: 0.27, wc: 1.05, yk: 0.05 },
  { x: 1.2, ys: 1.07, w: 1.13, yc: 0.32, wc: 0.9, yk: 0.09 },
  { x: 2.0, ys: 1.12, w: 0.92, yc: 0.42, wc: 0.66, yk: 0.17 },
  { x: 2.7, ys: 1.19, w: 0.6, yc: 0.6, wc: 0.36, yk: 0.34 },
  { x: 3.15, ys: 1.26, w: 0.24, yc: 0.88, wc: 0.1, yk: 0.62 },
  { x: 3.32, ys: 1.3, w: 0.03, yc: 1.05, wc: 0.02, yk: 0.95 },
] as const;

const RING = 7; // puntos por cuaderna: regala+ · brusca+ · pantoque+ · quilla · pantoque− · brusca− · regala−

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
    dPos.push(s.x, s.ys + 0.005, +s.w * 0.965);
    dPos.push(s.x, s.ys + 0.07, 0);
    dPos.push(s.x, s.ys + 0.005, -s.w * 0.965);
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
  for (const s of STATIONS) sheer.push(new THREE.Vector3(s.x, s.ys + 0.01, +(s.w + 0.012)));
  for (let i = N - 1; i >= 0; i--) {
    const s = STATIONS[i];
    sheer.push(new THREE.Vector3(s.x, s.ys + 0.01, -(s.w + 0.012)));
  }
  const stripeCurve = new THREE.CatmullRomCurve3(sheer, true, 'catmullrom', 0.1);
  const stripe = new THREE.TubeGeometry(stripeCurve, 240, 0.022, 8, true);

  return { hull, deck, stripe };
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

      {/* ── Proa abierta (bowrider): solárium en V + respaldos ──────── */}
      <mesh position={[1.6, 1.18, 0]} rotation={[0, 0, 0.07]}>
        <boxGeometry args={[1.6, 0.06, 0.95]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <RoundedBox args={[1.5, 0.14, 0.42]} radius={0.04} smoothness={4} position={[1.72, 1.27, 0.45]} rotation={[0, 0.28, 0.07]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.14, 0.42]} radius={0.04} smoothness={4} position={[1.72, 1.27, -0.45]} rotation={[0, -0.28, 0.07]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.14, 0.5]} radius={0.04} smoothness={4} position={[2.56, 1.33, 0]} rotation={[0, Math.PI / 4, 0.08]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      {/* Respaldos contra el parabrisas */}
      <RoundedBox args={[0.12, 0.34, 0.7]} radius={0.03} smoothness={4} position={[1.02, 1.35, 0.52]} rotation={[0, 0.12, 0.18]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.34, 0.7]} radius={0.03} smoothness={4} position={[1.02, 1.35, -0.52]} rotation={[0, -0.12, 0.18]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>

      {/* ── Parabrisas envolvente walk-through (marco oscuro + cristal) ─ */}
      <mesh position={[0.88, 1.52, 0.32]} rotation={[0, -0.28, -0.3]}>
        <boxGeometry args={[0.04, 0.52, 0.58]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.88, 1.52, -0.32]} rotation={[0, 0.28, -0.3]}>
        <boxGeometry args={[0.04, 0.52, 0.58]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.4, 1.5, 0.82]} rotation={[0, 0.62, -0.22]}>
        <boxGeometry args={[0.85, 0.48, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.4, 1.5, -0.82]} rotation={[0, -0.62, -0.22]}>
        <boxGeometry args={[0.85, 0.48, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      {/* Marco superior (moldura negra) */}
      <mesh position={[0.8, 1.78, 0.48]} rotation={[0, -0.28, -0.3]}>
        <boxGeometry args={[0.05, 0.05, 0.7]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.8, 1.78, -0.48]} rotation={[0, 0.28, -0.3]}>
        <boxGeometry args={[0.05, 0.05, 0.7]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>

      {/* ── Puesto de mando ─────────────────────────────────────────── */}
      <mesh position={[0.44, 1.36, -0.5]}>
        <boxGeometry args={[0.55, 0.42, 0.6]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.58, 1.58, -0.5]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.3, 0.08, 0.56]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.22, 1.52, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.13, 0.02, 10, 28]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {/* Asientos bucket (piloto y copiloto) */}
      {([-0.55, 0.55] as const).map((z) => (
        <group key={z} position={[-0.4, 0.08, z]}>
          <mesh position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.22, 10]} />
            <meshStandardMaterial {...DARK_TRIM} />
          </mesh>
          <RoundedBox args={[0.46, 0.13, 0.46]} radius={0.04} smoothness={4} position={[0, 1.24, 0]}>
            <meshStandardMaterial {...CUSHION} />
          </RoundedBox>
          <RoundedBox args={[0.12, 0.5, 0.44]} radius={0.04} smoothness={4} position={[-0.2, 1.52, 0]} rotation={[0, 0, 0.14]}>
            <meshStandardMaterial {...CUSHION} />
          </RoundedBox>
        </group>
      ))}

      {/* ── Bañera: suelo EVA gris + banco en L (babor) ─────────────── */}
      <mesh position={[-1.15, 1.08, 0]}>
        <boxGeometry args={[2.5, 0.05, 1.45]} />
        <meshStandardMaterial {...EVA_GRAY} />
      </mesh>
      <RoundedBox args={[1.7, 0.28, 0.42]} radius={0.05} smoothness={4} position={[-1.45, 1.26, 0.68]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[1.7, 0.3, 0.1]} radius={0.04} smoothness={4} position={[-1.45, 1.49, 0.9]} rotation={[-0.16, 0, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>

      {/* ── Popa: solárium sobre el motor + plataforma de baño ─────── */}
      <RoundedBox args={[0.95, 0.16, 1.75]} radius={0.05} smoothness={4} position={[-2.7, 1.16, 0]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.09, 1.6]} radius={0.04} smoothness={4} position={[-2.32, 1.26, 0]} rotation={[0, 0, -0.35]}>
        <meshStandardMaterial {...CUSHION} />
      </RoundedBox>
      <mesh position={[-3.6, 0.88, 0]}>
        <boxGeometry args={[0.55, 0.07, 1.7]} />
        <meshStandardMaterial {...DECK_WHITE} />
      </mesh>
      <mesh position={[-3.6, 0.925, 0]}>
        <boxGeometry args={[0.45, 0.02, 1.45]} />
        <meshStandardMaterial {...EVA_GRAY} />
      </mesh>
      {/* Cola del MerCruiser (sterndrive) */}
      <mesh position={[-3.52, 0.42, 0]}>
        <boxGeometry args={[0.3, 0.34, 0.2]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[-3.58, 0.18, 0]}>
        <boxGeometry args={[0.34, 0.16, 0.06]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>

      {/* ── Torre de wake NEGRA, inclinada a popa, con tabla arriba ── */}
      <group>
        <mesh position={[-0.33, 1.85, 0.78]} rotation={[0.24, 0, 0.48]}>
          <cylinderGeometry args={[0.045, 0.05, 1.7, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.33, 1.85, -0.78]} rotation={[-0.24, 0, 0.48]}>
          <cylinderGeometry args={[0.045, 0.05, 1.7, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-1.05, 1.83, 0.72]} rotation={[0.17, 0, -0.14]}>
          <cylinderGeometry args={[0.045, 0.05, 1.55, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-1.05, 1.83, -0.72]} rotation={[-0.17, 0, -0.14]}>
          <cylinderGeometry args={[0.045, 0.05, 1.55, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.58, 0.58]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.75, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.58, -0.58]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.75, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Soportes + tabla de wakeboard (roja, como en las fotos) */}
        <mesh position={[-0.85, 2.69, 0.24]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.69, -0.24]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <RoundedBox args={[0.16, 0.045, 1.2]} radius={0.02} smoothness={4} position={[-0.85, 2.78, 0]}>
          <meshStandardMaterial color="#8e2b26" metalness={0.3} roughness={0.35} envMapIntensity={0.8} />
        </RoundedBox>
      </group>

      {/* ── Detalles: cornamusas cromadas y luz de proa ─────────────── */}
      {([1, -1] as const).map((s) => (
        <group key={s}>
          <mesh position={[2.15, 1.17, s * 0.79]}>
            <boxGeometry args={[0.2, 0.045, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[-2.85, 1.05, s * 0.98]}>
            <boxGeometry args={[0.2, 0.045, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        </group>
      ))}
      <mesh position={[3.16, 1.33, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
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
