# Guía: conseguir el modelo 3D real de la Sea Ray SPX 210

El visor 3D de `/flota` ([components/Boat3DScene.tsx](../components/Boat3DScene.tsx)) usa un
barco *placeholder* hecho con primitivas. Esta guía explica cómo conseguir un modelo
**fiel** del barco del club (`.glb`) y cómo integrarlo.

> **Importante — 3d-boats.com:** el tour de la SPX 210 que existe en su catálogo
> (`3d-boats.com/boats/sea-ray-spx-210-2025`) está marcado `commercialSafe: false`
> en su propia API: **no tiene licencia para uso comercial** y además es *embed only*
> (no entregan archivo). Si interesa esa vía, hay que contactarles para escanear
> el barco del club con derechos propios ("Get your boat scanned").

---

## Opción A — Fotografiar el barco y reconstruirlo (gratis, resultado fiel)

### Apps (elige una, todas van bien con un móvil moderno)
- **Polycam** (iOS/Android) — modo *Photo mode*. La más sencilla. Exporta GLB en el plan de pago (prueba gratuita).
- **Luma AI** (iOS) — muy buena con superficies brillantes (cascos). Exporta GLB gratis.
- **RealityScan** (Epic, iOS/Android) — gratis, exporta a Sketchfab y de ahí GLB.
- Alternativa de escritorio 100 % gratis: **Meshroom** (fotos de cualquier cámara → OBJ → Blender → GLB).

### Condiciones ideales
| Factor | Ideal | Evitar |
|---|---|---|
| Ubicación | Barco **en seco** (marina seca, remolque) | Barco amarrado con mucho reflejo de agua |
| Luz | Día **nublado** o primera hora (luz difusa) | Sol duro de mediodía (brillos en el gelcoat) |
| Escena | Barco solo, defensas y lonas quitadas | Gente, cabos cruzando el casco |
| Movimiento | Todo quieto | Barco balanceándose (imposibilita la reconstrucción) |

El gelcoat brillante es lo más difícil: cuanto más difusa la luz, mejor. Si el barco
solo puede fotografiarse a flote y amarrado, hacedlo igualmente — saldrá bien la
obra muerta y la cubierta, y los bajos se cierran a mano en Blender.

### Patrón de captura (15–20 min)
1. **3 vueltas completas** alrededor del barco, a 3 alturas:
   - Vuelta 1: a la altura del casco (agachado), foto cada ~10° (≈36 fotos).
   - Vuelta 2: a la altura del pecho, foto cada ~10° (≈36 fotos).
   - Vuelta 3: desde arriba si se puede (pantalán alto, escalera, palo selfie), ≈24 fotos.
2. **Solape del 70 %**: cada foto debe compartir la mayor parte de la escena con la anterior.
3. **Detalles**: 15–20 fotos extra de proa, popa, consola, torre y logotipos.
4. Total orientativo: **100–250 fotos**. Sin flash, sin zoom, misma exposición si la app lo permite.

### Del resultado al `.glb` optimizado para web
El modelo saldrá con demasiada geometría/textura para una página (objetivo: **< 10 MB**):

```bash
# Optimización automática (draco + texturas WebP + poda):
npx @gltf-transform/cli optimize modelo-bruto.glb searay-spx-210.glb --texture-compress webp
```

Si hace falta retoque (cerrar los bajos del casco, borrar el pantalán): abrir en
**Blender** (gratis) → editar → `File > Export > glTF 2.0 (.glb)` y luego el comando de arriba.

## Opción B — Encargarlo a un artista 3D (100–500 €, 1–2 semanas)

Publicar encargo en **CGTrader** (sección *3D modeling services*), **Fiverr** o **Upwork**:
> "Game-ready GLB model of a 2025 Sea Ray SPX 210 bowrider, navy blue hull, white deck,
> wakeboard tower. Target < 50k triangles, PBR textures 2048px, for web (three.js)."

Adjuntad las fotos de `public/images/searay-*.jpg` como referencia (el casco azul del club).
Pedid **cesión de derechos para web comercial** por escrito.

## Integración (2 minutos)

1. Copiar el archivo final a `public/models/searay-spx-210.glb`.
2. Seguir los 4 pasos comentados en la cabecera de
   [components/Boat3DScene.tsx](../components/Boat3DScene.tsx)
   (sustituir `<PlaceholderBoat />` por `useGLTF`).
3. Ajustar escala: el encuadre está pensado para ~6,5 unidades de eslora centradas en el origen.
4. `npm run build` y revisar `/es/flota` antes de subir.

### Checklist antes de producción
- [ ] `.glb` < 10 MB (ideal < 5 MB)
- [ ] Licencia/derechos del modelo por escrito
- [ ] Probado en móvil real (iPhone + Android)
- [ ] `npm run build` sin errores
