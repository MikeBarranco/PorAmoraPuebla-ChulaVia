import { useEffect, useRef } from 'react'

/* SVG de una flor de 4 pétalos en azul marino */
const FLOWER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
  <g fill="none" stroke="#1B3A6B" stroke-width="0.9" opacity="0.55">
    <ellipse cx="11" cy="4"  rx="2.5" ry="6"/>
    <ellipse cx="11" cy="18" rx="2.5" ry="6"/>
    <ellipse cx="4"  cy="11" rx="6"   ry="2.5"/>
    <ellipse cx="18" cy="11" rx="6"   ry="2.5"/>
    <circle cx="11" cy="11" r="2" fill="#1B3A6B"/>
  </g>
</svg>
`)

/* Posiciones dispersas y fijas (porcentaje) — 14 flores bien separadas */
const FLOWERS = [
  { x:  6, y:  8, dur: 7,  r: 6,  delay: 0   },
  { x: 22, y: 32, dur: 9,  r: 5,  delay: 1.5 },
  { x: 41, y: 12, dur: 8,  r: 7,  delay: 0.8 },
  { x: 58, y: 28, dur: 11, r: 5,  delay: 2.2 },
  { x: 75, y:  7, dur: 7,  r: 8,  delay: 0.3 },
  { x: 88, y: 22, dur: 9,  r: 6,  delay: 1.8 },
  { x: 14, y: 55, dur: 10, r: 5,  delay: 0.6 },
  { x: 33, y: 68, dur: 8,  r: 7,  delay: 2.5 },
  { x: 50, y: 50, dur: 12, r: 6,  delay: 1.1 },
  { x: 67, y: 72, dur: 9,  r: 5,  delay: 3.0 },
  { x: 82, y: 58, dur: 7,  r: 8,  delay: 0.4 },
  { x:  8, y: 80, dur: 11, r: 6,  delay: 1.7 },
  { x: 47, y: 85, dur: 8,  r: 7,  delay: 2.8 },
  { x: 91, y: 88, dur: 10, r: 5,  delay: 0.9 },
]

export default function FlowersBg({ container }) {
  const layerRef = useRef(null)

  useEffect(() => {
    if (!container?.current) return
    const layer = document.createElement('div')
    layer.style.cssText = `
      position:absolute; inset:0;
      pointer-events:none; overflow:hidden; z-index:0;
    `
    layerRef.current = layer

    FLOWERS.forEach(({ x, y, dur, r, delay }) => {
      const el = document.createElement('div')
      /* Animación circular via keyframes en style inline */
      const animName = `orbit_${Math.random().toString(36).slice(2)}`
      const style = document.createElement('style')
      style.textContent = `
        @keyframes ${animName} {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(${r}px, 0px); }
          50%  { transform: translate(0px, ${r}px); }
          75%  { transform: translate(-${r}px, 0px); }
          100% { transform: translate(0px, 0px); }
        }
      `
      document.head.appendChild(style)

      el.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 22px;
        height: 22px;
        background-image: url("data:image/svg+xml,${FLOWER_SVG}");
        background-size: 22px 22px;
        animation: ${animName} ${dur}s ease-in-out ${delay}s infinite;
      `
      layer.appendChild(el)
    })

    /* Insertar como primer hijo para que quede debajo del contenido */
    container.current.style.position = 'relative'
    container.current.insertBefore(layer, container.current.firstChild)

    return () => {
      layer.remove()
    }
  }, [container])

  return null
}
