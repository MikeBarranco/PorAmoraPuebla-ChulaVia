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
`

/* ── Talavera decorative corner (una sola pieza, esquina) ── */
function TalavераCorner() {
  return (
    <svg
      width="420" height="420"
      viewBox="0 0 120 120"
      fill="none"
      style={{
        position: 'absolute',
        bottom: -40,
        right: -40,
        opacity: 0.08,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Talavera flower tile */}
      <ellipse cx="60" cy="22" rx="11" ry="20" fill="white"/>
      <ellipse cx="60" cy="98" rx="11" ry="20" fill="white"/>
      <ellipse cx="22" cy="60" rx="20" ry="11" fill="white"/>
      <ellipse cx="98" cy="60" rx="20" ry="11" fill="white"/>
      <circle  cx="60" cy="60" r="13" fill="white"/>
      <rect x="60" y="4" width="14" height="14" transform="rotate(45 60 11)" fill="white"/>
      <rect x="60" y="95" width="14" height="14" transform="rotate(45 60 109)" fill="white"/>
      <rect x="4" y="60" width="14" height="14" transform="rotate(45 11 60)" fill="white"/>
      <rect x="95" y="60" width="14" height="14" transform="rotate(45 109 60)" fill="white"/>
      <rect x="8" y="8" width="104" height="104" rx="6" stroke="white" strokeWidth="1.5" fill="none"/>
      <rect x="18" y="18" width="84" height="84" rx="4" stroke="white" strokeWidth="0.8" fill="none"/>
    </svg>
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
  { to: 6082, suffix: '',  label: 'Localidades rurales en Puebla',       icon: MapPin  },
  { to: 86,   suffix: '',  label: 'Municipios con alta marginacion',      icon: Shield  },
  { to: 90,   suffix: '%', label: 'Transporte informal en zonas rurales', icon: Route   },
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

  return (
    <main style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1B3A6B',
        color: '#FAFAFA',
        padding: '100px 24px 120px',
      }}>
        <TalavераCorner />

        {/* Segundo adorno arriba-izquierda, muy sutil */}
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 280, height: 280, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: -20, left: -20,
          width: 180, height: 180, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

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
        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 16 }}>
          Fuente: INEGI Censo 2020 · CONAPO Indices de Marginacion 2020 · Instituto Mexicano del Transporte
        </p>
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

      {/* ══ ROADMAP ══ */}
      <section style={{ padding: '96px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Hacia donde vamos
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              ChulaVia es el primer paso de una plataforma de movilidad que puede escalar a todo Puebla.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, position: 'relative' }}>
            {[
              {
                fase: '01',
                badge: 'En curso',
                badgeColor: '#F4C430',
                badgeText: '#1B3A6B',
                title: 'MVP — Hoy',
                items: ['Plataforma web + mapa interactivo', 'Bot de WhatsApp para reservas', 'Dashboard de datos para el gobierno', '15 comunidades de la Mixteca'],
              },
              {
                fase: '02',
                badge: 'Proximo',
                badgeColor: '#e8edf5',
                badgeText: '#6b7280',
                title: '3 meses',
                items: ['PWA instalable sin app store', 'Sistema de reportes de infraestructura', 'Paradas intermedias en rutas', 'SMS fallback para sin WhatsApp'],
              },
              {
                fase: '03',
                badge: 'Futuro',
                badgeColor: '#e8edf5',
                badgeText: '#6b7280',
                title: '6 meses',
                items: ['217 municipios de Puebla', 'Alianza con SMOT para datos oficiales', 'Comision por viaje confirmado', 'API publica para investigadores'],
              },
            ].map(({ fase, badge, badgeColor, badgeText, title, items }) => (
              <div key={fase} style={{
                backgroundColor: '#FAFAFA', border: '1.5px solid #e0e7f0',
                borderRadius: 20, padding: '32px 28px',
                position: 'relative',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    backgroundColor: '#1B3A6B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, color: '#F4C430',
                  }}>{fase}</div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 100,
                    backgroundColor: badgeColor, color: badgeText,
                    fontSize: 11, fontWeight: 700,
                  }}>{badge}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1B3A6B', margin: '0 0 16px' }}>{title}</h3>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#4b5563', lineHeight: 1.5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1B3A6B', marginTop: 7, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EQUIPO ══ */}
      <section style={{ padding: '96px 24px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              El equipo
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 380, margin: '0 auto', lineHeight: 1.65 }}>
              Cuatro especialidades, un solo objetivo: conectar a las comunidades rurales de Puebla.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
            {[
              { nombre: 'Miguel Barranco', rol: 'Frontend & UX', tech: 'React · Leaflet · Vite', iniciales: 'MB' },
              { nombre: 'Isabel', rol: 'Backend & API', tech: 'Django · Railway · Supabase', iniciales: 'IS' },
              { nombre: 'Monica', rol: 'Investigacion & Datos', tech: 'INEGI · CONAPO · Canva', iniciales: 'MO' },
              { nombre: 'Sumayra', rol: 'Pitch & Estrategia', tech: 'PED 2024-2030 · Impacto Social', iniciales: 'SU' },
            ].map(({ nombre, rol, tech, iniciales }) => (
              <div key={nombre} style={{
                backgroundColor: '#fff', border: '1.5px solid #e0e7f0',
                borderRadius: 20, padding: '32px 24px', textAlign: 'center',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  backgroundColor: '#1B3A6B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: 22, fontWeight: 800, color: '#F4C430',
                  letterSpacing: '0.05em',
                }}>{iniciales}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B', margin: '0 0 6px' }}>{nombre}</h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#2A6049', margin: '0 0 10px' }}>{rol}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{tech}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 100,
              backgroundColor: '#f0f4ff', border: '1px solid #dde3f0',
              fontSize: 12, fontWeight: 600, color: '#1B3A6B',
              letterSpacing: '0.03em',
            }}>
              Metodologia Scrum &bull; Sprint de 24 horas &bull; Backlog priorizado
            </span>
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
