import { useState } from 'react'
import { Search, MapPin, Clock, Star, Shield, ChevronDown, X, CheckCircle, MessageCircle, Users } from 'lucide-react'
import { comunidades, rutas } from '../data/comunidades'

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
        {ruta.verificado && <Badge color={GREEN}>Verificado</Badge>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Horarios
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
          Dias de servicio
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Star size={15} color={YELLOW} fill={YELLOW} />
          <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{ruta.calificacion}</span>
          <span style={{ fontSize: 13, color: GRAY }}>({ruta.totalViajes} viajes)</span>
          {ruta.verificado && <Shield size={14} color={GREEN} style={{ marginLeft: 4 }} />}
        </div>
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
          <MessageCircle size={15} /> Reservar por WhatsApp
        </button>
      </div>
    </div>
  )
}

function BookingModal({ ruta, onClose }) {
  const [phone, setPhone] = useState('')
  const [date,  setDate]  = useState('')
  const [pax,   setPax]   = useState(1)
  const [done,  setDone]  = useState(false)

  function confirm() {
    if (!phone || !date) return
    setDone(true)
  }

  return (
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
              Reservacion confirmada
            </h2>
            <p style={{ margin: '0 0 6px', fontSize: 14, color: GRAY }}>
              {ruta.origen} → {ruta.destino}
            </p>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY }}>
              Te contactamos por WhatsApp al <strong style={{ color: BLUE }}>{phone}</strong>
            </p>
            <div style={{ backgroundColor: '#f4f6fb', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: BLUE }}>Resumen</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Transportista: {ruta.transportista}</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Fecha: {date}</p>
              <p style={{ margin: '0 0 3px', fontSize: 13, color: GRAY }}>Pasajeros: {pax}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: BLUE }}>Total: ${ruta.precio * pax}</p>
            </div>
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
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: BLUE }}>Reservar viaje</h2>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY }}>
              {ruta.origen} → {ruta.destino} &nbsp;·&nbsp; ${ruta.precio} por persona
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
                  Numero de WhatsApp *
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
                Confirmar por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
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
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f4f6fb' }}>

      {/* Hero */}
      <div style={{ backgroundColor: BLUE, padding: '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <svg width="200" height="200" viewBox="0 0 120 120" fill="none"
          style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.06, pointerEvents: 'none' }}
          aria-hidden="true">
          <ellipse cx="60" cy="22" rx="11" ry="20" fill="white"/>
          <ellipse cx="60" cy="98" rx="11" ry="20" fill="white"/>
          <ellipse cx="22" cy="60" rx="20" ry="11" fill="white"/>
          <ellipse cx="98" cy="60" rx="20" ry="11" fill="white"/>
          <circle cx="60" cy="60" r="13" fill="white"/>
          <rect x="8" y="8" width="104" height="104" rx="6" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>

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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Desde</label>
              <Select value={origen} onChange={setOrigen} options={opciones} placeholder="Comunidad de origen" />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hasta</label>
              <Select value={destino} onChange={setDestino} options={opciones} placeholder="Comunidad de destino" />
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
                <Search size={17} /> Buscar
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: GRAY }}>
                <Users size={14} /> Capacidad disponible
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
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: BLUE }}>No encontramos rutas disponibles</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: GRAY, maxWidth: 360, marginInline: 'auto' }}>
              Aun no hay transportistas para esta ruta. Registramos tu solicitud para que la vean.
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
