import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, Shield, BarChart2, MessageCircle, ArrowRight, Users, Route } from 'lucide-react'

/* ── Keyframes ── */
const CSS = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes dot-blink {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.3; }
}
@keyframes tile-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(120px, 120px); }
}
@keyframes gradient-text {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@keyframes panGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100px, -100px); }
}
@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 30px) scale(1.1); }
}
`

/* ── Cyber-Talavera Spotlight Background ── */
function CyberTalaveraBackground() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden', pointerEvents: 'none',
      background: 'linear-gradient(135deg, #12284C 0%, #0d1e38 100%)',
    }}>
      {/* 1. Capa Base Oscura (siempre visible) */}
      <svg width="200%" height="200%" style={{ position: 'absolute', opacity: 0.08, animation: 'panGrid 40s linear infinite' }}>
        <defs>
          <pattern id="cyber-talavera" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#F4C430" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="white" strokeWidth="1" />
            <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="3" fill="#F4C430" />
            <circle cx="0" cy="0" r="1.5" fill="white" />
            <circle cx="100" cy="0" r="1.5" fill="white" />
            <circle cx="0" cy="100" r="1.5" fill="white" />
            <circle cx="100" cy="100" r="1.5" fill="white" />
            <line x1="0" y1="50" x2="15" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="100" y1="50" x2="85" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="15" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="100" x2="50" y2="85" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-talavera)" />
      </svg>

      {/* 2. Capa Brillante Interactiva (revelada por el mouse) */}
      <svg className="cyber-spotlight" width="200%" height="200%" style={{
        position: 'absolute', opacity: 0.7, animation: 'panGrid 40s linear infinite',
        maskImage: 'radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
        transition: 'mask-image 0.2s ease',
      }}>
        <defs>
          <pattern id="cyber-talavera-glow" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Solo tonos blancos muy sutiles y elegantes */}
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="white" strokeWidth="1.2" />
            <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="3" fill="white" />
            <circle cx="0" cy="0" r="2" fill="white" />
            <circle cx="100" cy="0" r="2" fill="white" />
            <circle cx="0" cy="100" r="2" fill="white" />
            <circle cx="100" cy="100" r="2" fill="white" />
            <line x1="0" y1="50" x2="15" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="100" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="15" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="50" y1="100" x2="50" y2="85" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-talavera-glow)" />
      </svg>
      
      {/* Esferas ambientales */}
      <div style={{
          position: 'absolute', top: '-10%', left: '10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,196,48,0.06) 0%, rgba(0,0,0,0) 70%)',
          animation: 'floatOrb 12s ease-in-out infinite alternate',
      }} />
    </div>
  )
}

/* ── Scroll fade hook ── */
function useFade() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, on]
}

/* ── Counter ── */
function Counter({ to, suffix = '' }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let cur = 0
      const id = setInterval(() => {
        cur += Math.ceil(to / 45)
        if (cur >= to) { setN(to); clearInterval(id) } else setN(cur)
      }, 28)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{n}{suffix}</span>
}

/* ── Data ── */
const STATS = [
  { to: 15,  suffix: '',  label: 'Comunidades conectadas',  icon: MapPin  },
  { to: 5,   suffix: '',  label: 'Transportistas verificados', icon: Shield },
  { to: 234, suffix: '+', label: 'Viajes realizados',        icon: Route   },
]

const STEPS = [
  { n: '01', icon: Search,        title: 'Busca tu ruta',         desc: 'Escribe de donde sales y a donde vas. Encontramos los transportistas disponibles cerca de ti.' },
  { n: '02', icon: Shield,        title: 'Elige con confianza',   desc: 'Ve horarios, precios y calificaciones de transportistas verificados por tu propia comunidad.' },
  { n: '03', icon: MessageCircle, title: 'Confirma por WhatsApp', desc: 'Sin app que instalar. Solo WhatsApp. Funciona con cualquier telefono y conexion basica.' },
]

const REASONS = [
  { icon: Shield,        title: 'Transportistas verificados', desc: 'INE confirmado, placa registrada y calificaciones reales de pasajeros.' },
  { icon: MessageCircle, title: 'Solo necesitas WhatsApp',    desc: 'Funciona con 2G. Sin smartphone caro ni internet rapido.' },
  { icon: BarChart2,     title: 'Datos para el gobierno',     desc: 'Primera base de datos de movilidad rural de Puebla.' },
  { icon: Users,         title: 'Hecho para comunidades',     desc: 'Para zonas donde el transporte formal no llega.' },
]

/* ── Component ── */
export default function Landing() {
  const [statsRef, statsOn] = useFade()
  const [stepsRef, stepsOn] = useFade()
  const [whyRef,   whyOn]   = useFade()
  const heroRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    heroRef.current.style.setProperty('--mouse-x', `${x}px`)
    heroRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <main style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if(heroRef.current) { heroRef.current.style.setProperty('--mouse-x', '-1000px'); heroRef.current.style.setProperty('--mouse-y', '-1000px'); } }}
        style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1B3A6B',
        color: '#FAFAFA',
        padding: '100px 24px 120px',
      }}>
        <CyberTalaveraBackground />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(244,196,48,0.15)',
            border: '1px solid rgba(244,196,48,0.3)',
            borderRadius: 100, padding: '5px 16px',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#F4C430', marginBottom: 28,
            animation: 'fadeUp 0.6s ease both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#F4C430', animation: 'dot-blink 2s ease infinite' }} />
            Hackathon Por Amor a Puebla 2026
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
            fontWeight: 800, lineHeight: 1.08,
            margin: '0 0 22px', letterSpacing: '-0.03em',
            maxWidth: 680,
            animation: 'fadeUp 0.7s ease 0.1s both',
          }}>
            Conecta tu comunidad.{' '}
            <span style={{ color: '#F4C430' }}>
              Muevete con confianza.
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: '1.1rem', lineHeight: 1.72,
            color: 'rgba(255,255,255,0.72)',
            margin: '0 0 48px', maxWidth: 500,
            animation: 'fadeUp 0.7s ease 0.2s both',
          }}>
            La primera plataforma de transporte intercomunitario rural de Puebla.
            Conectamos pasajeros con transportistas verificados donde el transporte
            formal no llega.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center',
            animation: 'fadeUp 0.7s ease 0.3s both',
          }}>
            <Link to="/buscar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                backgroundColor: '#F4C430', color: '#1B3A6B',
                padding: '14px 28px', borderRadius: 10,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(244,196,48,0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(244,196,48,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4C430'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(244,196,48,0.35)' }}
            >
              <Search size={17} /> Buscar transporte
            </Link>

            <Link to="/mapa"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.88)', padding: '14px 26px', borderRadius: 10,
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
            >
              <MapPin size={17} /> Ver mapa de rutas
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ backgroundColor: '#FAFAFA', padding: '0 24px' }}>
        <div
          ref={statsRef}
          style={{
            maxWidth: '72rem', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            transform: 'translateY(-44px)',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(27,58,107,0.13)',
            border: '1px solid #e8edf5',
            opacity: statsOn ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }}
        >
          {STATS.map(({ to, suffix, label, icon: Icon }, i) => (
            <div key={label} style={{
              backgroundColor: '#fff', padding: '36px 24px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid #f0f2f5' : 'none',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: '#1B3A6B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Icon size={21} color="#F4C430" aria-hidden="true" />
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#1B3A6B', lineHeight: 1, marginBottom: 8 }}>
                <Counter to={to} suffix={suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COMO FUNCIONA ══ */}
      <section ref={stepsRef} style={{ padding: '8px 24px 96px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Como funciona ChulaVia
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
              Simple, rapido y accesible desde cualquier telefono.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 24 }}>
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n}
                style={{
                  backgroundColor: '#fff', border: '1px solid #e8edf5',
                  borderRadius: 18, padding: '36px 28px',
                  position: 'relative', overflow: 'hidden',
                  opacity: stepsOn ? 1 : 0,
                  transform: stepsOn ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* número de fondo */}
                <span style={{
                  position: 'absolute', top: 12, right: 20,
                  fontSize: '3.8rem', fontWeight: 900, lineHeight: 1,
                  color: 'rgba(27,58,107,0.05)', userSelect: 'none',
                }}>
                  {n}
                </span>

                {/* ícono */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  backgroundColor: '#1B3A6B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
                }}>
                  <Icon size={24} color="#F4C430" aria-hidden="true" />
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1B3A6B', margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.68, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POR QUE ══ */}
      <section
        ref={whyRef}
        style={{
          padding: '96px 24px',
          backgroundColor: '#f4f6fb',
          borderTop: '1px solid #dde3f0',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

            <div style={{
              opacity: whyOn ? 1 : 0,
              transform: whyOn ? 'translateX(0)' : 'translateX(-24px)',
              transition: 'all 0.7s ease',
            }}>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 20px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Porque moverse en Puebla es un derecho, no un privilegio
              </h2>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, margin: '0 0 12px' }}>
                El <strong style={{ color: '#1B3A6B' }}>90% del transporte</strong> en comunidades de alta marginacion es informal.
                Sin rutas fijas, sin seguro, sin datos.
              </p>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, margin: '0 0 36px' }}>
                ChulaVia digitaliza ese transporte y genera por primera vez datos de movilidad rural
                para el gobierno de Puebla.
              </p>
              <Link to="/mapa"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: '#1B3A6B', fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', borderBottom: '2px solid #1B3A6B',
                  paddingBottom: 2, transition: 'gap 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '14px'}
                onMouseLeave={e => e.currentTarget.style.gap = '8px'}
              >
                Ver el mapa de comunidades <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
              opacity: whyOn ? 1 : 0,
              transform: whyOn ? 'translateX(0)' : 'translateX(24px)',
              transition: 'all 0.7s ease 0.15s',
            }}>
              {REASONS.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  style={{
                    backgroundColor: '#fff', border: '1px solid #e0e7f0',
                    borderRadius: 16, padding: '24px 20px',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,58,107,0.09)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    backgroundColor: '#1B3A6B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                  }}>
                    <Icon size={18} color="#F4C430" aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', margin: '0 0 7px' }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section style={{
        padding: '100px 24px',
        backgroundColor: '#1B3A6B',
        textAlign: 'center', color: '#FAFAFA',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Talavera corner decorativo en la sección CTA también */}
        <div style={{ position: 'absolute', top: -60, left: -60, pointerEvents: 'none' }}>
          <svg width="300" height="300" viewBox="0 0 120 120" fill="none" aria-hidden="true" style={{ opacity: 0.07 }}>
            <ellipse cx="60" cy="22" rx="11" ry="20" fill="white"/>
            <ellipse cx="60" cy="98" rx="11" ry="20" fill="white"/>
            <ellipse cx="22" cy="60" rx="20" ry="11" fill="white"/>
            <ellipse cx="98" cy="60" rx="20" ry="11" fill="white"/>
            <circle  cx="60" cy="60" r="13" fill="white"/>
            <rect x="8" y="8" width="104" height="104" rx="6" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            backgroundColor: '#F4C430',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <Users size={28} color="#1B3A6B" aria-hidden="true" />
          </div>

          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Eres transportista? Registrate gratis
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 16, lineHeight: 1.72, margin: '0 0 40px' }}>
            Llega a mas pasajeros, optimiza tus rutas y forma parte de la primera
            red de transporte rural digital de Puebla.
          </p>
          <Link to="/unirse"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              backgroundColor: '#F4C430', color: '#1B3A6B',
              padding: '15px 32px', borderRadius: 10,
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(244,196,48,0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(244,196,48,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4C430'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(244,196,48,0.35)' }}
          >
            Registrarme como transportista <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e8edf5',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="ChulaVia" style={{ height: 52, width: 'auto' }} />
          <p style={{ margin: 0, color: '#4b5563', fontSize: 14, fontWeight: 500 }}>
            Plataforma de movilidad rural intercomunitaria de Puebla
          </p>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: 12 }}>
            Hackathon Por Amor a Puebla 2026 &bull; Eje Movilidad Rural
          </p>
        </div>
      </footer>
    </main>
  )
}
