'use client';

/**
 * Boat3DScene — el visor WebGL (React Three Fiber).
 * La cámara ORBITA el barco en función del progreso de scroll (0 → 1) y el
 * barco "flota" con un balanceo sutil. Cuando la sección sale de pantalla,
 * el bucle de render se pausa (prop `active`) para no gastar GPU.
 *
 * El barco es una RECREACIÓN PROCEDIMENTAL de la Sea Ray SPX 210 del club,
 * modelada a partir de sus fotos reales (public/images/searay-*.jpg):
 * casco azul marino + fileteado rojo, proa abierta con solárium en V,
 * parabrisas envolvente walk-through, torre negra con tabla de wake,
 * banco en L, solárium de popa y plataforma de baño con pad gris.
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
import { ContactShadows } from '@react-three/drei';
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
const NAVY = { color: '#16264d', metalness: 0.35, roughness: 0.28 } as const; // gelcoat azul marino
const RED_STRIPE = { color: '#a83430', metalness: 0.3, roughness: 0.35 } as const; // fileteado
const DECK_WHITE = { color: '#f1eee6', metalness: 0.05, roughness: 0.5 } as const; // gelcoat cubierta
const CUSHION = { color: '#eae7de', roughness: 0.85 } as const; // tapicería blanca
const EVA_GRAY = { color: '#83868a', roughness: 0.95 } as const; // suelo EVA tipo teca gris
const DARK_TRIM = { color: '#2b2d33', metalness: 0.15, roughness: 0.6 } as const; // consola/molduras
const TOWER_BLACK = { color: '#17181c', metalness: 0.55, roughness: 0.4 } as const; // torre
const GLASS = { color: '#1e2f3a', metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.45 } as const;
const CHROME = { color: '#cdd2d7', metalness: 0.95, roughness: 0.15 } as const;

/** Recreación procedimental de la Sea Ray SPX 210 (ver cabecera). */
function SeaRaySpx210() {
  const { hullGeo, stripeGeo, deckGeo } = useMemo(() => {
    // Contorno en planta (proa hacia +X): espejo curvo → manga máxima a media
    // eslora popel → afinado a proa. Eslora ~6,6 u · manga ~2,56 u (fiel a specs).
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-3.3, -1.05);
    hullShape.quadraticCurveTo(-3.45, 0, -3.3, 1.05); // espejo de popa
    hullShape.quadraticCurveTo(-2.0, 1.26, -0.6, 1.28); // costado hasta manga máx.
    hullShape.quadraticCurveTo(1.7, 1.14, 3.3, 0); // amura → roda
    hullShape.quadraticCurveTo(1.7, -1.14, -0.6, -1.28);
    hullShape.quadraticCurveTo(-2.0, -1.26, -3.3, -1.05);
    hullShape.closePath();

    const hull = new THREE.ExtrudeGeometry(hullShape, {
      depth: 0.78,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.15,
      bevelSegments: 4,
    });
    hull.rotateX(-Math.PI / 2); // altura hacia +Y, contorno en planta XZ

    // Fileteado rojo: lámina fina con el mismo contorno, asomando por la cinta.
    const stripe = new THREE.ExtrudeGeometry(hullShape, { depth: 0.045, bevelEnabled: false });
    stripe.rotateX(-Math.PI / 2);

    // Cubierta: contorno inset, como tapa.
    const deckShape = new THREE.Shape();
    deckShape.moveTo(-3.16, -0.93);
    deckShape.quadraticCurveTo(-3.3, 0, -3.16, 0.93);
    deckShape.quadraticCurveTo(-1.95, 1.14, -0.6, 1.16);
    deckShape.quadraticCurveTo(1.62, 1.02, 3.16, 0);
    deckShape.quadraticCurveTo(1.62, -1.02, -0.6, -1.16);
    deckShape.quadraticCurveTo(-1.95, -1.14, -3.16, -0.93);
    deckShape.closePath();
    const deck = new THREE.ExtrudeGeometry(deckShape, { depth: 0.15, bevelEnabled: false });
    deck.rotateX(-Math.PI / 2);

    return { hullGeo: hull, stripeGeo: stripe, deckGeo: deck };
  }, []);

  return (
    <group>
      {/* ── Casco, fileteado y cubierta ─────────────────────────────── */}
      <mesh geometry={hullGeo} castShadow>
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh geometry={stripeGeo} position={[0, 0.9, 0]} scale={[1.012, 1, 1.035]}>
        <meshStandardMaterial {...RED_STRIPE} />
      </mesh>
      <mesh geometry={deckGeo} position={[0, 0.96, 0]}>
        <meshStandardMaterial {...DECK_WHITE} />
      </mesh>

      {/* ── Proa abierta (bowrider): solárium en V + respaldos ──────── */}
      <mesh position={[1.55, 1.1, 0]}>
        <boxGeometry args={[1.7, 0.07, 1.0]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[1.72, 1.18, 0.47]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.55, 0.15, 0.44]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      <mesh position={[1.72, 1.18, -0.47]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[1.55, 0.15, 0.44]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      <mesh position={[2.62, 1.18, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.52, 0.15, 0.52]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      {/* Respaldos contra el parabrisas */}
      <mesh position={[0.98, 1.3, 0.55]} rotation={[0, 0.12, 0.18]}>
        <boxGeometry args={[0.12, 0.34, 0.72]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      <mesh position={[0.98, 1.3, -0.55]} rotation={[0, -0.12, 0.18]}>
        <boxGeometry args={[0.12, 0.34, 0.72]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>

      {/* ── Parabrisas envolvente walk-through (marco oscuro + cristal) ─ */}
      {/* Paños frontales (con hueco central de paso) */}
      <mesh position={[0.86, 1.44, 0.34]} rotation={[0, -0.28, -0.3]}>
        <boxGeometry args={[0.04, 0.52, 0.6]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.86, 1.44, -0.34]} rotation={[0, 0.28, -0.3]}>
        <boxGeometry args={[0.04, 0.52, 0.6]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      {/* Paños laterales */}
      <mesh position={[0.38, 1.42, 0.85]} rotation={[0, 0.62, -0.22]}>
        <boxGeometry args={[0.85, 0.48, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      <mesh position={[0.38, 1.42, -0.85]} rotation={[0, -0.62, -0.22]}>
        <boxGeometry args={[0.85, 0.48, 0.04]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
      {/* Marco superior (moldura negra) */}
      <mesh position={[0.78, 1.7, 0.5]} rotation={[0, -0.28, -0.3]}>
        <boxGeometry args={[0.05, 0.05, 0.72]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.78, 1.7, -0.5]} rotation={[0, 0.28, -0.3]}>
        <boxGeometry args={[0.05, 0.05, 0.72]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>

      {/* ── Puesto de mando ─────────────────────────────────────────── */}
      {/* Consola (estribor) con salpicadero inclinado */}
      <mesh position={[0.42, 1.28, -0.52]}>
        <boxGeometry args={[0.55, 0.42, 0.62]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[0.56, 1.5, -0.52]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.3, 0.08, 0.58]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      {/* Volante deportivo */}
      <mesh position={[0.2, 1.45, -0.52]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.13, 0.02, 10, 28]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {/* Asientos bucket (piloto y copiloto) */}
      {([-0.55, 0.55] as const).map((z) => (
        <group key={z} position={[-0.4, 0, z]}>
          <mesh position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.22, 10]} />
            <meshStandardMaterial {...DARK_TRIM} />
          </mesh>
          <mesh position={[0, 1.24, 0]}>
            <boxGeometry args={[0.46, 0.13, 0.46]} />
            <meshStandardMaterial {...CUSHION} />
          </mesh>
          <mesh position={[-0.2, 1.52, 0]} rotation={[0, 0, 0.14]}>
            <boxGeometry args={[0.12, 0.5, 0.44]} />
            <meshStandardMaterial {...CUSHION} />
          </mesh>
        </group>
      ))}

      {/* ── Bañera: suelo EVA gris + banco en L (babor) ─────────────── */}
      <mesh position={[-1.35, 1.03, 0]}>
        <boxGeometry args={[2.3, 0.05, 1.5]} />
        <meshStandardMaterial {...EVA_GRAY} />
      </mesh>
      <mesh position={[-1.45, 1.22, 0.72]}>
        <boxGeometry args={[1.7, 0.28, 0.42]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      <mesh position={[-1.45, 1.44, 0.94]} rotation={[-0.16, 0, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.1]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>

      {/* ── Popa: solárium sobre el motor + plataforma de baño ─────── */}
      <mesh position={[-2.72, 1.22, 0]}>
        <boxGeometry args={[0.95, 0.16, 1.85]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      <mesh position={[-2.34, 1.32, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.3, 0.09, 1.7]} />
        <meshStandardMaterial {...CUSHION} />
      </mesh>
      {/* Plataforma de baño con pad EVA gris */}
      <mesh position={[-3.62, 0.84, 0]}>
        <boxGeometry args={[0.6, 0.08, 1.8]} />
        <meshStandardMaterial {...DECK_WHITE} />
      </mesh>
      <mesh position={[-3.62, 0.89, 0]}>
        <boxGeometry args={[0.5, 0.02, 1.55]} />
        <meshStandardMaterial {...EVA_GRAY} />
      </mesh>
      {/* Cola del MerCruiser (sterndrive) */}
      <mesh position={[-3.55, 0.38, 0]}>
        <boxGeometry args={[0.3, 0.34, 0.2]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>
      <mesh position={[-3.6, 0.14, 0]}>
        <boxGeometry args={[0.34, 0.16, 0.06]} />
        <meshStandardMaterial {...DARK_TRIM} />
      </mesh>

      {/* ── Torre de wake NEGRA, inclinada a popa, con tabla arriba ── */}
      <group>
        {/* Patas delanteras (suben inclinándose a popa y hacia dentro) */}
        <mesh position={[-0.33, 1.78, 0.8]} rotation={[0.24, 0, 0.48]}>
          <cylinderGeometry args={[0.045, 0.05, 1.7, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.33, 1.78, -0.8]} rotation={[-0.24, 0, 0.48]}>
          <cylinderGeometry args={[0.045, 0.05, 1.7, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Patas traseras (casi verticales) */}
        <mesh position={[-1.05, 1.78, 0.74]} rotation={[0.17, 0, -0.14]}>
          <cylinderGeometry args={[0.045, 0.05, 1.55, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-1.05, 1.78, -0.74]} rotation={[-0.17, 0, -0.14]}>
          <cylinderGeometry args={[0.045, 0.05, 1.55, 12]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Largueros superiores y travesaño */}
        <mesh position={[-0.85, 2.52, 0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.75, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.52, -0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.75, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.54, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.24, 10]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        {/* Soportes de tabla + tabla de wakeboard (roja, como en las fotos) */}
        <mesh position={[-0.85, 2.63, 0.24]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.63, -0.24]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial {...TOWER_BLACK} />
        </mesh>
        <mesh position={[-0.85, 2.72, 0]}>
          <boxGeometry args={[0.16, 0.045, 1.2]} />
          <meshStandardMaterial color="#8e2b26" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Detalles: cornamusas cromadas y luz de proa ─────────────── */}
      {([1, -1] as const).map((s) => (
        <group key={s}>
          <mesh position={[2.15, 1.13, s * 0.8]}>
            <boxGeometry args={[0.2, 0.045, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[-2.85, 1.13, s * 0.95]}>
            <boxGeometry args={[0.2, 0.045, 0.05]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        </group>
      ))}
      <mesh position={[3.02, 1.13, 0]}>
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
      {/* Iluminación de estudio (sin HDRI externo → todo self-contained) */}
      <hemisphereLight args={['#dbeaff', '#c9c2b4', 1.0]} />
      <directionalLight position={[6, 9, 5]} intensity={1.7} />
      <directionalLight position={[-7, 4, -5]} intensity={0.5} color="#9fb8d6" />
      <spotLight position={[0, 8, 0]} angle={0.6} penumbra={1} intensity={0.4} />

      <FloatingGroup>
        <SeaRaySpx210 />
      </FloatingGroup>

      {/* Sombra de contacto suave — ancla el barco al "suelo" del estudio */}
      <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={22} blur={2.6} far={7} resolution={512} color="#1A1916" />

      <CameraRig progress={progress} />
    </Canvas>
  );
}
