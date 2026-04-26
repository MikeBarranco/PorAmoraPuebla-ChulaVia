import { useState } from 'react'
import { Search, MapPin, Clock, Star, Shield, ChevronDown, X, CheckCircle, MessageCircle, Users, Timer, ChevronUp, Navigation } from 'lucide-react'
import { comunidades, rutas } from '../data/comunidades'
import { api } from '../data/api'
import { useT } from '../context/LangContext.jsx'
import TripSimulator from '../components/TripSimulator'

const BLUE   = '#1B3A6B'
const YELLOW = '#F4C430'
const GREEN  = '#2A6049'
const GRAY   = '#6b7280'

function Badge({ children, color = BLUE }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      backgroundColor: color + '18', color,
    }}>
      {children}
    </span>
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', appearance: 'none',
          padding: '13px 40px 13px 16px',
          border: '1.5px solid #dde3f0', borderRadius: 10,
          fontSize: 15, color: value ? BLUE : GRAY,
          backgroundColor: '#fff', cursor: 'pointer',
          outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = BLUE}
        onBlur={e => e.target.style.borderColor = '#dde3f0'}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} color={GRAY} style={{
        position: 'absolute', right: 14, top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  )
}

function RouteCard({ ruta, onBook }) {
  const [showResenas, setShowResenas] = useState(false)
  const t = useT()
  return (
    <div style={{
      backgroundColor: '#fff', border: '1.5px solid #e8edf5',
      borderRadius: 16, padding: '24px',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <MapPin size={14} color={BLUE} />
            <span style={{ fontSize: 16, fontWeight: 700, color: BLUE }}>
              {ruta.origen} → {ruta.destino}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: GRAY }}>{ruta.transportista}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: BLUE }}>${ruta.precio}</p>
          <p style={{ margin: 0, fontSize: 12, color: GRAY }}>por persona</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Badge color={BLUE}>{ruta.tipo}</Badge>
        <Badge color={GREEN}>{ruta.capacidad} lugares</Badge>
        {ruta.verificado && <Badge color={GREEN}>{t('general','verificado')}</Badge>}
        {ruta.eta && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 100,
            fontSize: 11, fontWeight: 600,
            backgroundColor: '#fef9c3', color: '#854d0e',
          }}>
            <Timer size={11} /> {t('resultados','tiempo_estimado')} {ruta.eta}
          </span>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('resultados','horarios')}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ruta.horarios.map(h => (
            <span key={h} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 8,
              backgroundColor: '#f4f6fb', fontSize: 13,
              fontWeight: 600, color: BLUE, border: '1px solid #e8edf5',
            }}>
              <Clock size={12} color={GRAY} /> {h}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('resultados','dias_de_servicio')}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Lun','Mar','Mie','Jue','Vie','Sab','Dom'].map(d => (
            <span key={d} style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, fontSize: 11, fontWeight: 600,
              backgroundColor: ruta.dias.includes(d) ? BLUE : '#f4f6fb',
              color: ruta.dias.includes(d) ? '#fff' : '#9ca3af',
              border: `1px solid ${ruta.dias.includes(d) ? BLUE : '#e8edf5'}`,
            }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f0f2f5' }}>
        <button
          onClick={() => setShowResenas(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <Star size={15} color={YELLOW} fill={YELLOW} />
          <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{ruta.calificacion}</span>
          <span style={{ fontSize: 13, color: GRAY }}>({ruta.totalViajes} viajes)</span>
          {ruta.verificado && <Shield size={14} color={GREEN} style={{ marginLeft: 4 }} />}
          {ruta.resenas?.length > 0 && (
            showResenas
              ? <ChevronUp size={14} color={GRAY} />
              : <ChevronDown size={14} color={GRAY} />
          )}
        </button>
        <button
          onClick={() => onBook(ruta)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            backgroundColor: YELLOW, color: BLUE,
            padding: '10px 20px', borderRadius: 8,
            fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(244,196,48,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = YELLOW; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <MessageCircle size={15} /> {t('resultados','reservar_viaje')}
        </button>
      </div>

      {showResenas && ruta.resenas?.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f2f5', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reseñas de pasajeros
          </p>
          {ruta.resenas.map((r, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>{r.autor}</span>
                <span style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={10} color={YELLOW} fill={j < r.estrellas ? YELLOW : 'none'} />
                  ))}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{r.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function makeFolio() {
  const n = Math.floor(Math.random() * 9000) + 1000
  return `CVA-2026-${n}`
}

function BookingModal({ ruta, onClose }) {
  const t = useT()
  const [phone, setPhone] = useState('')
  const [date,  setDate]  = useState('')
  const [pax,   setPax]   = useState(1)
  const [done,  setDone]  = useState(false)
  const [folio, setFolio] = useState('')
  const [simulando, setSimulando] = useState(false)

  function confirm() {
    if (!phone || !date) return
    const newFolio = makeFolio()
    setFolio(newFolio)
    api.crearSolicitud({
      origen_texto: ruta.origen,
      destino_texto: ruta.destino,
      ruta: ruta.id ?? null,
      pasajeros: pax,
      telefono_whatsapp: phone,
      fecha_viaje: date,
      estado: 'confirmada',
    }).catch(() => {})
    setDone(true)
  }

  return (
    <>
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: 20,
        width: '100%', maxWidth: 460, padding: '32px',
        position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        <button onClick={onClose} aria-label="Cerrar" style={{
          position: 'absolute', top: 16, right: 16,
          border: 'none', background: 'none', cursor: 'pointer',
          padding: 4, color: GRAY, display: 'flex',
        }}>
          <X size={20} />
        </button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              backgroundColor: 'rgba(42,96,73,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={32} color={GREEN} />
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: BLUE }}>
              {t('busqueda','modal_exito')}
            </h2>
            <div style={{
              display: 'inline-block', backgroundColor: '#1B3A6B', color: '#F4C430',
              padding: '4px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', marginBottom: 14,
            }}>
              {t('busqueda','modal_folio')}: {folio}
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 14, color: GRAY }}>
              {ruta.origen} → {ruta.destino}
            </p>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY }}>
              {t('busqueda','modal_contacto')} <strong style={{ color: BLUE }}>{phone}</strong>
            </p>
            <div style={{ backgroundColor: '#f4f6fb', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: BLUE }}>Resumen</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Folio: <strong style={{ color: BLUE }}>{folio}</strong></p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Transportista: {ruta.transportista}</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Fecha: {date}</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Pasajeros: {pax}</p>
              <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: BLUE }}>Total: ${ruta.precio * pax}</p>
              <p style={{ margin: 0, fontSize: 12, color: GRAY }}>Muestra este folio al transportista el día del viaje.</p>
            </div>
            <button
              onClick={() => setSimulando(true)}
              style={{
                width: '100%', backgroundColor: '#F4C430', color: BLUE,
                padding: 12, borderRadius: 10, border: 'none',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Navigation size={18} /> Simular el viaje en tiempo real
            </button>
            <button onClick={onClose} style={{
              width: '100%', backgroundColor: BLUE, color: '#fff',
              padding: 12, borderRadius: 10, border: 'none',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: BLUE }}>{t('busqueda','modal_titulo')}</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY }}>
              {ruta.origen} → {ruta.destino} &nbsp;·&nbsp; ${ruta.precio} por persona
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
                  {t('busqueda','modal_tel')} *
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Ej. 2221234567"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1.5px solid #dde3f0', fontSize: 15,
                    outline: 'none', fontFamily: 'inherit', color: BLUE, boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = BLUE}
                  onBlur={e => e.target.style.borderColor = '#dde3f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
                  Fecha de viaje *
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1.5px solid #dde3f0', fontSize: 15,
                    outline: 'none', fontFamily: 'inherit', color: BLUE, boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = BLUE}
                  onBlur={e => e.target.style.borderColor = '#dde3f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
                  Pasajeros
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {['-', '+'].map((op, i) => (
                    <button key={op} onClick={() => setPax(p => op === '-' ? Math.max(1, p-1) : Math.min(ruta.capacidad, p+1))}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: '1.5px solid #dde3f0', backgroundColor: '#f4f6fb',
                        cursor: 'pointer', fontSize: 18, color: BLUE,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      {op}
                    </button>
                  ))}
                  <span style={{ fontSize: 18, fontWeight: 700, color: BLUE, minWidth: 24, textAlign: 'center' }}>{pax}</span>
                  <span style={{ fontSize: 13, color: GRAY }}>max. {ruta.capacidad}</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f4f6fb', borderRadius: 12, padding: '14px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: BLUE }}>Total estimado</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: BLUE }}>${ruta.precio * pax}</span>
              </div>

              <button onClick={confirm} disabled={!phone || !date}
                style={{
                  width: '100%',
                  backgroundColor: phone && date ? YELLOW : '#e5e7eb',
                  color: phone && date ? BLUE : '#9ca3af',
                  padding: 13, borderRadius: 10, border: 'none',
                  fontWeight: 700, fontSize: 15,
                  cursor: phone && date ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}>
                {t('busqueda','modal_btn')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>

    {simulando && (
      <TripSimulator
        ruta={ruta}
        solicitudId={null}
        onClose={() => setSimulando(false)}
      />
    )}
    </>
  )
}

export default function SearchPage() {
  const t = useT()
  const [origen,   setOrigen]   = useState('')
  const [destino,  setDestino]  = useState('')
  const [searched, setSearched] = useState(false)
  const [booking,  setBooking]  = useState(null)

  const opciones = comunidades.map(c => ({ value: c.nombre, label: c.nombre }))

  const resultados = searched
    ? rutas.filter(r =>
        (!origen  || r.origen === origen  || r.destino === origen) &&
        (!destino || r.destino === destino || r.origen  === destino)
      )
    : []

  function buscar() {
    if (!origen && !destino) return
    setSearched(true)
  }

  function limpiar() {
    setOrigen(''); setDestino(''); setSearched(false)
  }

  return (
    <div className="cv-flowers-bg" style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f4f6fb' }}>

      {/* Hero */}
      <div className="cv-cyber-bg" style={{ backgroundColor: '#1B3A6B', padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>


        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Encuentra tu transporte
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 16, margin: '0 0 36px' }}>
            Rutas intercomunitarias verificadas en la region Mixteca de Puebla
          </p>

          <div style={{
            backgroundColor: '#fff', borderRadius: 16, padding: '24px',
            display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('busqueda','origen')}</label>
              <Select value={origen} onChange={setOrigen} options={opciones} placeholder={t('busqueda','de_donde_sales')} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('busqueda','destino')}</label>
              <Select value={destino} onChange={setDestino} options={opciones} placeholder={t('busqueda','a_donde_vas')} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={buscar} disabled={!origen && !destino}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  backgroundColor: (origen || destino) ? YELLOW : '#e5e7eb',
                  color: (origen || destino) ? BLUE : '#9ca3af',
                  padding: '13px 24px', borderRadius: 10, border: 'none',
                  fontWeight: 700, fontSize: 15, cursor: (origen || destino) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (origen || destino) e.currentTarget.style.backgroundColor = '#e8b800' }}
                onMouseLeave={e => { if (origen || destino) e.currentTarget.style.backgroundColor = YELLOW }}
              >
                <Search size={17} /> {t('busqueda','buscar')}
              </button>
              {searched && (
                <button onClick={limpiar} aria-label="Limpiar busqueda"
                  style={{
                    display: 'flex', alignItems: 'center', padding: '13px 14px',
                    borderRadius: 10, border: '1.5px solid #dde3f0',
                    backgroundColor: '#fff', cursor: 'pointer', color: GRAY,
                  }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div style={{ maxWidth: '72rem', margin: '-36px auto 0', padding: '0 24px 64px' }}>

        {!searched && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '48px 24px', textAlign: 'center', border: '1px solid #e8edf5' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(27,58,107,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Search size={28} color={BLUE} style={{ opacity: 0.4 }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: BLUE }}>Selecciona tu origen y destino</h3>
            <p style={{ margin: '0 0 28px', fontSize: 14, color: GRAY }}>Encontramos las rutas disponibles para ti en segundos.</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Rutas populares</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {rutas.slice(0, 4).map(r => (
                <button key={r.id}
                  onClick={() => { setOrigen(r.origen); setDestino(r.destino); setSearched(true) }}
                  style={{
                    padding: '8px 16px', borderRadius: 100,
                    border: '1.5px solid #dde3f0', backgroundColor: '#f4f6fb',
                    fontSize: 13, fontWeight: 500, color: BLUE, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.backgroundColor = '#eef1f8' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#dde3f0'; e.currentTarget.style.backgroundColor = '#f4f6fb' }}
                >
                  {r.origen} → {r.destino}
                </button>
              ))}
            </div>
          </div>
        )}

        {searched && resultados.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 20px' }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: BLUE }}>
                {resultados.length} ruta{resultados.length !== 1 ? 's' : ''} encontrada{resultados.length !== 1 ? 's' : ''}
                {origen && destino ? ` · ${origen} → ${destino}` : ''}
              </p>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 8, 
                fontSize: 14, fontWeight: 600, color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.12)',
                padding: '6px 14px', borderRadius: 10,
                backdropFilter: 'blur(4px)',
              }}>
                <Users size={16} color={YELLOW} /> Capacidad disponible
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {resultados.map(r => <RouteCard key={r.id} ruta={r} onBook={setBooking} />)}
            </div>
          </div>
        )}

        {searched && resultados.length === 0 && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '48px 24px', textAlign: 'center', border: '1px solid #e8edf5' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(27,58,107,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MapPin size={28} color={BLUE} style={{ opacity: 0.4 }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: BLUE }}>{t('busqueda','sin_resultados')}</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY, maxWidth: 360, marginInline: 'auto' }}>
              {t('busqueda','intenta')}
            </p>
            <button onClick={limpiar} style={{ backgroundColor: BLUE, color: '#fff', padding: '11px 24px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Buscar otra ruta
            </button>
          </div>
        )}
      </div>

      {booking && <BookingModal ruta={booking} onClose={() => setBooking(null)} />}
    </div>
  )
}
