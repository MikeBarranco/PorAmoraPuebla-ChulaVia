import { useEffect, useRef, useState } from 'react'
import { MapPin, AlertCircle, CheckCircle, X, Navigation } from 'lucide-react'
import { comunidades, rutas } from '../data/comunidades'

/* leaflet se importa dinamicamente para evitar errores de SSR */
let L = null

const BLUE   = '#1B3A6B'
const YELLOW = '#F4C430'
const RED    = '#C1440E'
const GREEN  = '#2A6049'

function createIcon(color) {
  if (!L) return null
  const svg = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`
  return L.divIcon({
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
    className: '',
  })
}

export default function MapPage() {
  const mapRef   = useRef(null)
  const mapObj   = useRef(null)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('todas')
  const [loaded, setLoaded]     = useState(false)

  useEffect(() => {
    let mounted = true

    async function initMap() {
      if (mapObj.current) return
      L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      if (!mounted || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [18.28, -98.25],
        zoom: 10,
        zoomControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map)

      comunidades.forEach(c => {
        const color = c.tieneTransporte ? GREEN : RED
        const marker = L.marker([c.lat, c.lng], { icon: createIcon(color) })

        const rutasComunidad = rutas.filter(
          r => r.origen === c.nombre || r.destino === c.nombre
        )

        marker.bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:200px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <span style="
                display:inline-block;width:10px;height:10px;border-radius:50%;
                background:${color};flex-shrink:0;
              "></span>
              <strong style="color:${BLUE};font-size:15px;">${c.nombre}</strong>
            </div>
            <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">
              Municipio: ${c.municipio}
            </p>
            <p style="color:#6b7280;font-size:13px;margin:0 0 10px;">
              Poblacion: ${c.poblacion.toLocaleString()} hab.
            </p>
            <span style="
              display:inline-block;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:600;
              background:${c.tieneTransporte ? 'rgba(42,96,73,0.12)' : 'rgba(193,68,14,0.12)'};
              color:${c.tieneTransporte ? GREEN : RED};
            ">
              ${c.tieneTransporte ? 'Con transporte' : 'Sin transporte formal'}
            </span>
            ${rutasComunidad.length > 0 ? `
              <div style="margin-top:12px;border-top:1px solid #f0f0f0;padding-top:10px;">
                <p style="color:${BLUE};font-size:12px;font-weight:600;margin:0 0 6px;">
                  Rutas disponibles (${rutasComunidad.length})
                </p>
                ${rutasComunidad.map(r => `
                  <div style="font-size:12px;color:#4b5563;margin-bottom:3px;">
                    ${r.origen} &rarr; ${r.destino}
                    <span style="color:#9ca3af;"> $${r.precio}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `, { maxWidth: 280 })

        marker.on('click', () => setSelected(c))
        marker.addTo(map)
      })

      /* dibujar lineas de rutas */
      rutas.forEach(r => {
        const origen  = comunidades.find(c => c.nombre === r.origen)
        const destino = comunidades.find(c => c.nombre === r.destino)
        if (!origen || !destino) return
        L.polyline(
          [[origen.lat, origen.lng], [destino.lat, destino.lng]],
          { color: BLUE, weight: 2.5, opacity: 0.5, dashArray: '6 4' }
        ).addTo(map)
      })

      mapObj.current = map
      if (mounted) setLoaded(true)
    }

    initMap()
    return () => { mounted = false }
  }, [])

  const sinCobertura  = comunidades.filter(c => !c.tieneTransporte).length
  const conCobertura  = comunidades.filter(c =>  c.tieneTransporte).length

  const rutasComunidadSeleccionada = selected
    ? rutas.filter(r => r.origen === selected.nombre || r.destino === selected.nombre)
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)' }}>

      {/* ── Header ── */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8edf5',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: BLUE }}>
            Mapa de movilidad rural
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>
            Region Mixteca &bull; Puebla, Mexico
          </p>
        </div>

        {/* Leyenda + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block' }} />
            Con transporte ({conCobertura})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: RED, display: 'inline-block' }} />
            Sin transporte ({sinCobertura})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 24, height: 2, borderTop: `2px dashed ${BLUE}`, display: 'inline-block', opacity: 0.6 }} />
            Ruta activa ({rutas.length})
          </div>
        </div>
      </div>

      {/* ── Mapa + Panel ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Mapa */}
        <div ref={mapRef} style={{ flex: 1, minHeight: 0 }} />

        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#f4f6fb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, color: BLUE,
          }}>
            <Navigation size={32} style={{ opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Cargando mapa...</p>
          </div>
        )}

        {/* Panel lateral — comunidad seleccionada */}
        {selected && (
          <div style={{
            width: 300, flexShrink: 0,
            backgroundColor: '#fff',
            borderLeft: '1px solid #e8edf5',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: BLUE }}>{selected.nombre}</h2>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{selected.municipio}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar panel"
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  padding: 4, color: '#9ca3af',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              backgroundColor: selected.tieneTransporte
                ? 'rgba(42,96,73,0.08)' : 'rgba(193,68,14,0.08)',
            }}>
              {selected.tieneTransporte
                ? <CheckCircle size={18} color={GREEN} />
                : <AlertCircle size={18} color={RED} />}
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: selected.tieneTransporte ? GREEN : RED }}>
                  {selected.tieneTransporte ? 'Con transporte formal' : 'Sin transporte formal'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                  {selected.tieneTransporte
                    ? 'Cuenta con ruta registrada'
                    : 'Solo transporte informal'}
                </p>
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Poblacion', value: selected.poblacion.toLocaleString() + ' hab.' },
                { label: 'Municipio', value: selected.municipio },
                { label: 'Latitud',   value: selected.lat.toFixed(4) },
                { label: 'Longitud',  value: selected.lng.toFixed(4) },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  backgroundColor: '#f8f9fb', borderRadius: 10,
                  padding: '10px 12px',
                }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: BLUE, fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Rutas */}
            <div>
              <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: BLUE }}>
                Rutas disponibles ({rutasComunidadSeleccionada.length})
              </h3>
              {rutasComunidadSeleccionada.length === 0 ? (
                <div style={{
                  padding: '14px', borderRadius: 10,
                  backgroundColor: 'rgba(193,68,14,0.06)',
                  border: '1px solid rgba(193,68,14,0.12)',
                  textAlign: 'center',
                }}>
                  <AlertCircle size={20} color={RED} style={{ margin: '0 auto 6px' }} />
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                    No hay rutas registradas para esta comunidad.
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
                    Existe demanda sin cobertura.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rutasComunidadSeleccionada.map(r => (
                    <div key={r.id} style={{
                      padding: '12px 14px', borderRadius: 10,
                      backgroundColor: '#f8f9fb',
                      border: '1px solid #e8edf5',
                    }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: BLUE }}>
                        {r.origen} &rarr; {r.destino}
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{r.transportista}</span>
                        <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>${r.precio}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>⭐ {r.calificacion}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
                        {r.horarios.slice(0, 3).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boton buscar */}
            <a
              href="/buscar"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                backgroundColor: BLUE, color: '#fff',
                padding: '11px 0', borderRadius: 10,
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d55'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = BLUE}
            >
              <MapPin size={15} /> Buscar transporte aqui
            </a>
          </div>
        )}
      </div>

      {/* ── Footer del mapa ── */}
      <div style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e8edf5',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
          {comunidades.length} comunidades &bull; {rutas.length} rutas &bull; Datos: ChulaVia 2026
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
          Mapa: &copy; OpenStreetMap / CARTO
        </p>
      </div>
    </div>
  )
}
