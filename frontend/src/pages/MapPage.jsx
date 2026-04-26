import { useEffect, useRef, useState } from 'react'
import { MapPin, AlertCircle, CheckCircle, X, Navigation } from 'lucide-react'
import { comunidades, rutas } from '../data/comunidades'
import comunidadesMapa from '../data/comunidades_mapa.json'
import { useT } from '../context/LangContext.jsx'

let L = null

const BLUE   = '#1B3A6B'
const YELLOW = '#F4C430'
const RED    = '#C1440E'
const GREEN  = '#2A6049'

/* Foto por nombre de comunidad (seed communities de Sumayra) */
const FOTOS = {
  'Tehuitzingo':          '/zonas/Tehuitzingo.png',
  'Acatlan de Osorio':    '/zonas/Acatlan_de_Osorio.png',
  'Chiautla de Tapia':    '/zonas/Chiautla_de_Tapia.png',
  'Izucar de Matamoros':  '/zonas/Izucar_de_Matamoros.jpeg',
  'Coatzingo':            '/zonas/Coatzingo.jpg',
  'Piaxtla':              '/zonas/Piaxtla.png',
  'Xayacatlan de Bravo':  '/zonas/Xayacatlan_de_Bravo.png',
  'San Pablo Anicano':    '/zonas/San_Pablo_Anicano.png',
  'Huehuetlan el Grande': '/zonas/Huehuetlan_el_Grande.png',
  'Tulcingo del Valle':   '/zonas/Tulcingo.png',
}

function createIcon(color) {
  if (!L) return null
  const svg = `
    <svg width="28" height="36" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`
  return L.divIcon({
    html: svg,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
    className: '',
  })
}

const sinCobertura = comunidadesMapa.filter(c => !c.tieneTransporte).length
const conCobertura = comunidadesMapa.filter(c =>  c.tieneTransporte).length

export default function MapPage() {
  const t = useT()
  const mapRef   = useRef(null)
  const mapObj   = useRef(null)
  const layersRef = useRef({ todos: [], con: [], sin: [] })
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
        center: [18.5, -97.8],
        zoom: 8,
        zoomControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map)

      /* ── Nombres de seed communities para lookup rápido ── */
      const seedNombres = new Set(comunidades.map(c => c.nombre))

      /* ── Todas las comunidades del JSON (691) como circle markers uniformes ── */
      comunidadesMapa.forEach(c => {
        const color = c.tieneTransporte ? GREEN : RED
        const esSeed = seedNombres.has(c.nombre)
        const circle = L.circleMarker([c.lat, c.lng], {
          radius:      esSeed ? 9 : 5,
          fillColor:   color,
          color:       esSeed ? '#F4C430' : 'white',
          weight:      esSeed ? 2.5 : 0.8,
          fillOpacity: esSeed ? 1 : 0.72,
        }).bindTooltip(esSeed
          ? `<strong>⭐ ${c.nombre}</strong><br>${c.municipio}<br><em style="color:#2A6049">Haz clic para ver rutas</em>`
          : `<strong>${c.nombre}</strong><br>${c.municipio}`, {
          sticky: true,
          className: 'cv-tooltip',
        })
        circle.addTo(map)
        layersRef.current.todos.push(circle)
        if (c.tieneTransporte) layersRef.current.con.push(circle)
        else layersRef.current.sin.push(circle)
      })

      /* ── Comunidades seed: círculo invisible encima solo para capturar click → panel ── */
      comunidades.forEach(c => {
        const color = c.tieneTransporte ? GREEN : RED
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: 10, fillOpacity: 0, color: 'transparent', weight: 0,
        })

        const rutasComunidad = rutas.filter(
          r => r.origen === c.nombre || r.destino === c.nombre
        )

        const fotoHtml = FOTOS[c.nombre]
          ? `<img src="${FOTOS[c.nombre]}" alt="${c.nombre}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>`
          : ''

        marker.bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:200px;">
            ${fotoHtml}
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></span>
              <strong style="color:${BLUE};font-size:15px;">${c.nombre}</strong>
            </div>
            <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Municipio: ${c.municipio}</p>
            <p style="color:#6b7280;font-size:13px;margin:0 0 10px;">Población: ${c.poblacion.toLocaleString()} hab.</p>
            <span style="display:inline-block;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:600;background:${c.tieneTransporte ? 'rgba(42,96,73,0.12)' : 'rgba(193,68,14,0.12)'};color:${c.tieneTransporte ? GREEN : RED};">
              ${c.tieneTransporte ? 'Con transporte' : 'Sin transporte formal'}
            </span>
            ${rutasComunidad.length > 0 ? `
              <div style="margin-top:10px;border-top:1px solid #f0f0f0;padding-top:8px;">
                <p style="color:${BLUE};font-size:12px;font-weight:600;margin:0 0 5px;">Rutas (${rutasComunidad.length})</p>
                ${rutasComunidad.map(r => `
                  <div style="font-size:12px;color:#4b5563;margin-bottom:3px;">
                    ${r.origen} → ${r.destino}
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

      /* ── Líneas de rutas ── */
      rutas.forEach(r => {
        const origen  = comunidades.find(c => c.nombre === r.origen)
        const destino = comunidades.find(c => c.nombre === r.destino)
        if (!origen || !destino) return
        L.polyline(
          [[origen.lat, origen.lng], [destino.lat, destino.lng]],
          { color: BLUE, weight: 2.5, opacity: 0.5, dashArray: '6 4' }
        ).addTo(map)
      })

      /* ── Zoom dinámico: ajusta tamaño de círculos al acercar ── */
      function actualizarRadios() {
        const z = map.getZoom()
        const rNormal = z >= 12 ? 7  : z >= 10 ? 6  : 5
        const rSeed   = z >= 12 ? 13 : z >= 10 ? 11 : 9
        layersRef.current.todos.forEach(c => {
          const esSeed = c.options.weight === 2.5
          c.setRadius(esSeed ? rSeed : rNormal)
        })
      }
      map.on('zoomend', actualizarRadios)

      mapObj.current = map
      if (mounted) setLoaded(true)
    }

    initMap()
    return () => { mounted = false }
  }, [])

  /* Aplicar filtro cuando cambia */
  useEffect(() => {
    if (!mapObj.current) return
    const { todos, con, sin } = layersRef.current
    todos.forEach(l => { try { mapObj.current.removeLayer(l) } catch {} })
    const toShow = filter === 'con' ? con : filter === 'sin' ? sin : todos
    toShow.forEach(l => l.addTo(mapObj.current))
  }, [filter])

  const rutasComunidadSeleccionada = selected
    ? rutas.filter(r => r.origen === selected.nombre || r.destino === selected.nombre)
    : []

  const foto = selected ? FOTOS[selected.nombre] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)' }}>

      {/* ── Header ── */}
      <div className="cv-flowers-bg" style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8edf5',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: BLUE }}>
            {t('mapa','titulo')}
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>
            Puebla, México · {comunidadesMapa.length.toLocaleString()} comunidades registradas
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Leyenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#374151' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: GREEN, border: '2px solid #F4C430', display: 'inline-block' }} />
              {t('mapa','con_rutas')} ({comunidades.length})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block' }} />
              {t('mapa','filtro_con')} ({conCobertura})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: RED, display: 'inline-block' }} />
              {t('mapa','filtro_sin')} ({sinCobertura})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 24, height: 2, borderTop: `2px dashed ${BLUE}`, display: 'inline-block', opacity: 0.6 }} />
              {t('mapa','ruta_activa')} ({rutas.length})
            </span>
          </div>

          {/* Filtro */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'todas', label: t('mapa','filtro_todas') },
              { id: 'con',   label: t('mapa','filtro_con') },
              { id: 'sin',   label: t('mapa','filtro_sin') },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  border: `1.5px solid ${filter === f.id ? BLUE : '#e0e7ef'}`,
                  backgroundColor: filter === f.id ? BLUE : '#fff',
                  color: filter === f.id ? '#fff' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mapa + Panel ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        <div ref={mapRef} style={{ flex: 1, minHeight: 0 }} />

        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#f4f6fb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, color: BLUE,
          }}>
            <Navigation size={32} style={{ opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>{t('mapa','cargando')}</p>
          </div>
        )}

        {/* Panel lateral */}
        {selected && (
          <div style={{
            width: 300, flexShrink: 0,
            backgroundColor: '#fff',
            borderLeft: '1px solid #e8edf5',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {/* Foto */}
            {foto && (
              <img
                src={foto}
                alt={selected.nombre}
                style={{
                  width: '100%', height: 140,
                  objectFit: 'cover', borderRadius: 12,
                  border: '1px solid #e8edf5',
                }}
              />
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: BLUE }}>{selected.nombre}</h2>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{selected.municipio}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar panel"
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: '#9ca3af', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              backgroundColor: selected.tieneTransporte ? 'rgba(42,96,73,0.08)' : 'rgba(193,68,14,0.08)',
            }}>
              {selected.tieneTransporte
                ? <CheckCircle size={18} color={GREEN} />
                : <AlertCircle size={18} color={RED} />}
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: selected.tieneTransporte ? GREEN : RED }}>
                  {selected.tieneTransporte ? t('mapa','con_cobertura') : t('mapa','sin_cobertura')}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                  {selected.tieneTransporte ? t('mapa','con_ruta_reg') : t('mapa','solo_informal')}
                </p>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: t('mapa','panel_poblacion'), value: selected.poblacion.toLocaleString() + ' hab.' },
                { label: t('mapa','panel_municipio'), value: selected.municipio },
                { label: 'Lat',                       value: selected.lat.toFixed(4) },
                { label: 'Lng',                       value: selected.lng.toFixed(4) },
              ].map(({ label, value }) => (
                <div key={label} style={{ backgroundColor: '#f8f9fb', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: BLUE, fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Rutas */}
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: BLUE }}>
                {t('mapa','panel_rutas')} ({rutasComunidadSeleccionada.length})
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
                    {t('mapa','sin_rutas')}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
                    {t('mapa','demanda')}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rutasComunidadSeleccionada.map(r => (
                    <div key={r.id} style={{
                      padding: '12px 14px', borderRadius: 10,
                      backgroundColor: '#f8f9fb', border: '1px solid #e8edf5',
                    }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: BLUE }}>
                        {r.origen} → {r.destino}
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
              <MapPin size={15} /> {t('mapa','btn_buscar')}
            </a>
          </div>
        )}
      </div>

      {/* ── Footer del mapa ── */}
      <div style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e8edf5',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
          {comunidadesMapa.length.toLocaleString()} comunidades · {rutas.length} rutas activas · Datos: INEGI 2020 / ChulaVía 2026
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
          Mapa: © OpenStreetMap / CARTO
        </p>
      </div>

      <style>{`
        .cv-tooltip {
          background: white;
          border: 1px solid #e8edf5;
          border-radius: 6px;
          padding: 4px 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #1B3A6B;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .cv-tooltip::before { display: none; }
      `}</style>
    </div>
  )
}
