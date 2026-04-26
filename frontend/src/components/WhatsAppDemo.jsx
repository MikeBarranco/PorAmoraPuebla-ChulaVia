import { useState, useEffect, useRef } from 'react'

const STEPS = [
  { from: 'bot',  text: '👋 Bienvenido a ChulaVía!\n¿De dónde sales? Escribe el nombre de tu comunidad.' },
  { from: 'user', text: 'Tehuitzingo' },
  { from: 'bot',  text: 'Salida desde: Tehuitzingo ✓\n¿A dónde vas?' },
  { from: 'user', text: 'Acatlán de Osorio' },
  { from: 'bot',  text: '🚐 Encontramos 2 opciones:\n\n1. Ernesto García · Combi\n   $35 · Sale: 07:00 y 12:00\n   ⭐ 4.8 · Verificado ✓\n\n2. María Guadalupe · Camioneta\n   $40 · Sale: 06:30\n   ⭐ 4.6 · Verificado ✓\n\nResponde 1 o 2 para reservar.' },
  { from: 'user', text: '1' },
  { from: 'bot',  text: '✅ ¡Reservación confirmada!\n\nErnesto García te espera a las 07:00.\nContacto: 222-134-5678\nPrecio: $35 por persona\n\nEscribe "hola" para buscar otra ruta.' },
]

export default function WhatsAppDemo() {
  const [visible, setVisible] = useState([STEPS[0]])
  const [step, setStep]       = useState(0)
  const [typing, setTyping]   = useState(false)
  const bottomRef             = useRef(null)
  const chatRef               = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visible, typing])

  function advance() {
    const nextUser = STEPS[step + 1]
    if (!nextUser) return
    setVisible(v => [...v, nextUser])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const nextBot = STEPS[step + 2]
      if (nextBot) setVisible(v => [...v, nextBot])
      setStep(s => s + 2)
    }, 900)
  }

  const nextUser  = STEPS[step + 1]
  const finished  = !nextUser

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 24px' }}>

      {/* Phone mockup */}
      <div style={{
        width: 320, maxWidth: '100%',
        borderRadius: 32,
        boxShadow: '0 24px 64px rgba(27,58,107,0.18), 0 4px 16px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        border: '8px solid #1B3A6B',
        background: '#ECE5DD',
      }}>

        {/* WhatsApp header */}
        <div style={{
          background: '#075E54',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            backgroundColor: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🚐</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>ChulaVía Bot</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>en línea</div>
          </div>
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{
          height: 340,
          overflowY: 'auto',
          padding: '12px 10px',
          display: 'flex', flexDirection: 'column', gap: 6,
          background: '#ECE5DD',
          scrollbarWidth: 'thin',
        }}>
          {visible.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '82%',
                backgroundColor: msg.from === 'user' ? '#DCF8C6' : '#fff',
                borderRadius: msg.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                padding: '8px 12px',
                fontSize: 13,
                lineHeight: 1.55,
                color: '#111',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
                <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'right', marginTop: 2 }}>
                  {msg.from === 'user' ? '✓✓' : ''} {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px 12px 12px 2px',
                padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    backgroundColor: '#9ca3af',
                    animation: `wa-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply bar */}
        <div style={{
          background: '#f0f0f0',
          borderTop: '1px solid #ddd',
          padding: '10px 12px',
          minHeight: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {finished ? (
            <div style={{ fontSize: 12, color: '#4b5563', fontStyle: 'italic', textAlign: 'center' }}>
              ¡Reservación completada! Así funciona ChulaVía por WhatsApp.
            </div>
          ) : nextUser && !typing ? (
            <button
              onClick={advance}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: '#25D366', color: '#fff',
                border: 'none', borderRadius: 20,
                padding: '8px 18px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', width: '100%', justifyContent: 'space-between',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1fbe59'}
              onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
            >
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Enviar →</span>
              <span>"{nextUser.text}"</span>
              <span>➤</span>
            </button>
          ) : (
            <div style={{ fontSize: 12, color: '#9ca3af' }}>esperando respuesta...</div>
          )}
        </div>
      </div>

      {/* Reset link */}
      {finished && (
        <button
          onClick={() => { setVisible([STEPS[0]]); setStep(0); setTyping(false) }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#1B3A6B', fontSize: 13, fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          Ver demo otra vez
        </button>
      )}

      <style>{`
        @keyframes wa-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
