import type Lenis from 'lenis';

/* Registro global de la instancia de Lenis. Los overlays (funnel, quiz,
   menú, galería) bloquean el scroll del body al abrirse, pero Lenis
   intercepta la rueda a nivel de documento: sin pausarlo, el ratón no
   puede scrollear dentro de los paneles. Cada overlay llama a
   getLenis()?.stop() al abrir y .start() al cerrar. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
