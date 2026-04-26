import { useState, useEffect, useRef } from 'react'
import { X, Star, Navigation, Users, Shield } from 'lucide-react'
import { api } from '../data/api'

const BLUE   = '#1B3A6B'
const GREEN  = '#2A6049'
const YELLOW = '#F4C430'
const GRAY   = '#6b7280'

/* Mensajes del bot según fase */
const SCRIPT = [
  { delay: 300,  from: 'bot',  text: (r) => `✅ ¡Reservación confirmada!\n\n${r.transportista} te espera a las ${r.horarios[0]}.\nContacto: 222-134-5678\nPrecio: $${r.precio} por persona` },
  { delay: 2200, from: 'bot',  text: () => '🚐 Tu viaje ha iniciado. El transportista ya está en camino.' },
  { delay: 4500, from: 'bot',  text: (r) => `Ruta en progreso.\nTodo va bien — llegada estimada en unos minutos.` },
  { delay: 7500, from: 'bot',  text: (r) => `✅ ¡Has llegado a ${r.destino}!\n\nGracias por viajar con ChulaVía.` },
  { delay: 9000, from: 'bot',  text: (r) => `⭐ ¿Cómo estuvo el servicio de ${r.transportista}?\n\nResponde para calificar tu experiencia:` },
]

const DRIVER_SCRIPT = [
  { delay: 2500, text: (r) => `🚐 Tienes un viaje activo: ${r.origen} → ${r.destino}\nPasajero confirmado` },
  { delay: 7800, text: (r) => `✅ Viaje completado. +$${r.precio} registrado.\n+1 viaje acumulado` },
  { delay: 9200, text: (r) => `⭐ Tu pasajero está calificando tu servicio...` },
]

const TOTAL_MS = 9000

export default function TripSimulator({ ruta, solicitudId, onClose }) {
  const [progress, setProgress]     = useState(0)
  const [messages, setMessages]     = useState([])
  const [driverMsgs, setDriverMsgs] = useState([])
  const [phase, setPhase]           = useState('traveling') // traveling | rating | done
  const [rating, setRating]         = useState(0)
  const [hover, setHover]           = useState(0)
  const [newRating, setNewRating]   = useState(null)
  const chatRef   = useRef(null)
  const drvRef    = useRef(null)

  /* Progress bar */
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / TOTAL_MS) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  /* Passenger messages */
  useEffect(() => {
    const timers = SCRIPT.map(s =>
      setTimeout(() => {
        setMessages(m => [...m, { from: s.from, text: s.text(ruta) }])
        if (s.delay >= 9000) setPhase('rating')
      }, s.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  /* Driver messages */
  useEffect(() => {
    const timers = DRIVER_SCRIPT.map(s =>
      setTimeout(() => setDriverMsgs(m => [...m, { text: s.text(ruta) }]), s.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  /* Auto scroll */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])
  useEffect(() => {
    if (drvRef.current) drvRef.current.scrollTop = drvRef.current.scrollHeight
  }, [driverMsgs])

  function submitRating(stars) {
    setRating(stars)
    const updated = Math.min(5, parseFloat((ruta.calificacion * 0.85 + stars * 0.15).toFixed(1)))
    setNewRating(updated)
    setPhase('done')

    /* Hit Isabel's completar_solicitud endpoint if we have a real ID */
    if (solicitudId) {
      api.completarSolicitud(solicitudId).catch(() => {})
    }

    setMessages(m => [...m, {
      from: 'bot',
      text: `⭐ ¡Gracias por calificar!\n\nRegistramos tu ${stars} estrella${stars !== 1 ? 's' : ''} para ${ruta.transportista}.\nSu calificación se actualizó: ${ruta.calificacion} → ${updated} ⭐\n\n¡Hasta el próximo viaje!`,
    }])
    setDriverMsgs(m => [...m, {
      text: `🌟 Nueva reseña recibida: ${stars} estrellas\nTu nueva calificación: ${updated} ⭐\nSeguís siendo de los mejores en ChulaVía.`,
    }])
  }

  const busPos = Math.max(0, Math.min(1, (progress - 10) / 75))

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 900,
        backgroundColor: '#fff', borderRadius: 24,
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        overflow: 'hidden', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          backgroundColor: BLUE, color: '#fff',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Navigation size={20} color={YELLOW} />
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                Simulación de viaje — ChulaVía
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                {ruta.origen} → {ruta.destino} · {ruta.transportista}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ height: 4, backgroundColor: '#e8edf5' }}>
          <div style={{
            height: '100%', backgroundColor: YELLOW,
            width: `${progress}%`, transition: 'width 0.1s linear',
          }} />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

          {/* Left: Route visualization */}
          <div style={{
            width: 260, flexShrink: 0, borderRight: '1px solid #e8edf5',
            padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16,
            backgroundColor: '#f8f9fb',
          }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Navigation size={14} /> Ruta en tiempo real
            </h3>

            {/* Route visual */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center' }}>

              {/* Origin */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: GREEN, border: '3px solid #fff', boxShadow: '0 0 0 2px ' + GREEN, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>{ruta.origen}</span>
              </div>

              {/* Route line with bus */}
              <div style={{ position: 'relative', width: 14, height: 120, marginLeft: 0 }}>
                {/* Static line */}
                <div style={{ position: 'absolute', left: 6, top: 0, width: 2, height: '100%', backgroundColor: '#dde3f0', borderRadius: 1 }} />
                {/* Progress fill */}
                <div style={{
                  position: 'absolute', left: 6, top: 0, width: 2,
                  height: `${busPos * 100}%`, backgroundColor: BLUE, borderRadius: 1,
                  transition: 'height 0.1s linear',
                }} />
                {/* Bus emoji */}
                <div style={{
                  position: 'absolute', left: -4,
                  top: `${busPos * 100}%`,
                  transform: 'translateY(-50%)',
                  fontSize: 20,
                  transition: 'top 0.15s linear',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}>
                  🚐
                </div>
              </div>

              {/* Destination */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch', marginTop: 12 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  backgroundColor: progress >= 100 ? YELLOW : '#dde3f0',
                  border: '3px solid #fff',
                  boxShadow: progress >= 100 ? '0 0 0 2px ' + YELLOW : '0 0 0 2px #dde3f0',
                  flexShrink: 0,
                  transition: 'all 0.5s ease',
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>{ruta.destino}</span>
              </div>
            </div>

            {/* ETA badge */}
            <div style={{
              backgroundColor: progress >= 100 ? 'rgba(42,96,73,0.1)' : 'rgba(27,58,107,0.06)',
              borderRadius: 10, padding: '10px 14px', textAlign: 'center',
            }}>
              {progress < 100 ? (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: GRAY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>En camino</p>
                  <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: BLUE }}>
                    {Math.max(0, Math.round((1 - progress / 100) * 9))} min
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 18 }}>✅</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 700, color: GREEN }}>¡Llegaste!</p>
                </>
              )}
            </div>

            {/* Transportista info */}
            <div style={{ backgroundColor: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #e8edf5' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: GRAY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transportista</p>
              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: BLUE }}>{ruta.transportista}</p>
              <p style={{ margin: 0, fontSize: 12, color: GRAY }}>{ruta.tipo} · {ruta.capacidad} lugares</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <Star size={12} color={YELLOW} fill={YELLOW} />
                <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>
                  {newRating ?? ruta.calificacion}
                  {newRating && (
                    <span style={{ fontSize: 10, color: GREEN, marginLeft: 4 }}>
                      ↑ actualizado
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Passenger WhatsApp */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* WA Header */}
            <div style={{ backgroundColor: '#075E54', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: '50%', 
                backgroundColor: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <img src="/logo.png" alt="Bot" style={{ width: '85%', height: 'auto' }} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 13 }}>ChulaVía Bot</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>pasajero</p>
              </div>
            </div>

            {/* Chat */}
            <div ref={chatRef} style={{
              flex: 1, overflowY: 'auto', backgroundColor: '#ECE5DD',
              padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    backgroundColor: m.from === 'user' ? '#DCF8C6' : '#fff',
                    borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    padding: '8px 12px', fontSize: 13, lineHeight: 1.55, color: '#111',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)', whiteSpace: 'pre-line',
                  }}>
                    {m.text}
                    <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'right', marginTop: 2 }}>
                      {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rating UI */}
            <div style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', padding: '12px 16px', minHeight: 60 }}>
              {phase === 'rating' && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 12, color: GRAY }}>Toca las estrellas para calificar:</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s}
                        onClick={() => submitRating(s)}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.15s' }}
                      >
                        <Star
                          size={32}
                          color={YELLOW}
                          fill={(hover || rating) >= s ? YELLOW : 'none'}
                          style={{ transform: hover >= s ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {phase === 'done' && (
                <div style={{ textAlign: 'center', fontSize: 13, color: GREEN, fontWeight: 600 }}>
                  ✅ ¡Calificación enviada! Gracias por usar ChulaVía.
                </div>
              )}
              {phase === 'traveling' && (
                <div style={{ fontSize: 12, color: GRAY, textAlign: 'center' }}>
                  {progress < 15 ? 'Conectando con el bot...' : progress < 80 ? '🚐 Viaje en progreso...' : '📍 Llegando al destino...'}
                </div>
              )}
            </div>
          </div>

          {/* Right: Driver WhatsApp */}
          <div style={{ width: 240, flexShrink: 0, borderLeft: '1px solid #e8edf5', display: 'flex', flexDirection: 'column' }}>
            {/* WA Header */}
            <div style={{ backgroundColor: '#075E54', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: '50%', 
                backgroundColor: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <img src="/logo.png" alt="Bot" style={{ width: '85%', height: 'auto' }} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 12 }}>ChulaVía Bot</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>transportista</p>
              </div>
            </div>

            {/* Driver chat */}
            <div ref={drvRef} style={{
              flex: 1, overflowY: 'auto', backgroundColor: '#ECE5DD',
              padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {driverMsgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    maxWidth: '90%',
                    backgroundColor: '#fff',
                    borderRadius: '10px 10px 10px 2px',
                    padding: '7px 10px', fontSize: 12, lineHeight: 1.5, color: '#111',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)', whiteSpace: 'pre-line',
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Driver footer */}
            <div style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', padding: '10px 12px' }}>
              {phase === 'done' && newRating && (
                <div style={{
                  backgroundColor: 'rgba(42,96,73,0.1)', borderRadius: 8, padding: '8px 10px', textAlign: 'center',
                }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: GREEN }}>Calificación actualizada</p>
                  <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: BLUE }}>
                    ⭐ {newRating}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: GRAY }}>antes: {ruta.calificacion}</p>
                </div>
              )}
              {phase !== 'done' && (
                <p style={{ margin: 0, fontSize: 11, color: GRAY, textAlign: 'center' }}>Panel del conductor</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {phase === 'done' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e8edf5', backgroundColor: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GREEN }} />
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>
                Datos guardados en el dashboard del gobierno — nueva calificación registrada
              </span>
            </div>
            <button onClick={onClose} style={{
              backgroundColor: BLUE, color: '#fff',
              padding: '8px 20px', borderRadius: 8, border: 'none',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
