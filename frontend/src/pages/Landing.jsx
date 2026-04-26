import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, Shield, BarChart2, MessageCircle, ArrowRight, Users, Route } from 'lucide-react'
import WhatsAppDemo from '../components/WhatsAppDemo'
import { useT } from '../context/LangContext.jsx'

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
@keyframes panGrid {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-100px, -100px); }
}
@keyframes floatOrb {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 30px) scale(1.1); }
}
.gradient-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(27,58,107,0.12) 20%, rgba(244,196,48,0.3) 50%, rgba(27,58,107,0.12) 80%, transparent);
  border: none;
  margin: 0;
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
      <svg width="200%" height="200%" style={{ position: 'absolute', opacity: 0.08, animation: 'panGrid 40s linear infinite' }}>
        <defs>
          <pattern id="cyber-talavera" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#F4C430" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="white" strokeWidth="1" />
            <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="3" fill="#F4C430" />
            <circle cx="0" cy="0" r="1.5" fill="white" /><circle cx="100" cy="0" r="1.5" fill="white" />
            <circle cx="0" cy="100" r="1.5" fill="white" /><circle cx="100" cy="100" r="1.5" fill="white" />
            <line x1="0" y1="50" x2="15" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="100" y1="50" x2="85" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="15" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="100" x2="50" y2="85" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-talavera)" />
      </svg>

      <svg width="200%" height="200%" style={{
        position: 'absolute', opacity: 0.7, animation: 'panGrid 40s linear infinite',
        maskImage: 'radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
      }}>
        <defs>
          <pattern id="cyber-talavera-glow" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="white" strokeWidth="1.2" />
            <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="3" fill="white" />
            <circle cx="0" cy="0" r="2" fill="white" /><circle cx="100" cy="0" r="2" fill="white" />
            <circle cx="0" cy="100" r="2" fill="white" /><circle cx="100" cy="100" r="2" fill="white" />
            <line x1="0" y1="50" x2="15" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="100" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="15" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="50" y1="100" x2="50" y2="85" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-talavera-glow)" />
      </svg>

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

/* ── Iconos fijos (no cambian con idioma) ── */
const STATS_ICONS = [MapPin, Shield, Route]
const STEPS_ICONS = [Search, Shield, MessageCircle]
const REASONS_ICONS = [Shield, MessageCircle, BarChart2, Users]

const TEAM = [
  { nombre: 'Miguel Barranco', rol: 'Frontend & UX',        tech: 'React · Leaflet · Vite',          foto: '/equipo/Miguel-Barranco.jpeg',  iniciales: 'MB' },
  { nombre: 'Isabel Ruiz',     rol: 'Backend & API',         tech: 'Django · Railway · Supabase',     foto: '/equipo/Isabel-Ruiz.jpeg',       iniciales: 'IR' },
  { nombre: 'Monica Tapia',    rol: 'Investigacion & Datos', tech: 'INEGI · CONAPO · Canva',          foto: '/equipo/Monica-Tapia.jpeg',      iniciales: 'MT' },
  { nombre: 'Sumayra Rivera',  rol: 'Pitch & Estrategia',    tech: 'PED 2024-2030 · Impacto Social',  foto: '/equipo/Sumayra-Rivera.jpeg',    iniciales: 'SR' },
]

/* ── Sprint Accordion ── */
const SPRINTS = [
  {
    label: 'Sprint 1 · Horas 0–8',
    color: '#dcfce7', textColor: '#15803d',
    tasks: ['Setup de proyecto: React + Vite + TailwindCSS', 'Landing page con hero, estadísticas INEGI y secciones', 'Backend Django: modelos, API REST, seed de 15 comunidades', 'Mapa interactivo con Leaflet y datos reales de Puebla'],
  },
  {
    label: 'Sprint 2 · Horas 8–16',
    color: '#FEF9C3', textColor: '#854D0E',
    tasks: ['Buscador de transporte con resultados y reservación', 'Bot de WhatsApp (Twilio) con flujo origen → destino → confirmación', 'Dashboard de gobierno con gráficas Recharts', 'Panel de registro de transportistas con subida de foto'],
  },
  {
    label: 'Sprint 3 · Horas 16–24',
    color: '#e8edf5', textColor: '#1B3A6B',
    tasks: ['PWA instalable: manifest.json + Service Worker', 'Internacionalización: Español, Nahuatl y Totonaco', 'Responsividad completa: móvil, tablet y escritorio', 'Deploy: Vercel (frontend) + Railway (backend) en producción'],
  },
]

function SprintAccordion() {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {SPRINTS.map((sprint, i) => {
        const isOpen = open === i
        return (
          <div key={i} style={{ borderRadius: 14, border: '1.5px solid rgba(27,58,107,0.1)', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ padding: '3px 10px', borderRadius: 100, backgroundColor: sprint.color, color: sprint.textColor, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {sprint.label}
                </span>
              </div>
              <span style={{ fontSize: 18, color: '#1B3A6B', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
            </button>
            {isOpen && (
              <ul style={{ margin: 0, padding: '0 20px 16px 20px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sprint.tasks.map(task => (
                  <li key={task} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#374151', lineHeight: 1.55 }}>
                    <span style={{ marginTop: 5, width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1B3A6B', flexShrink: 0 }} />
                    {task}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Component ── */
export default function Landing() {
  const t = useT()
  const [statsRef, statsOn] = useFade()
  const [stepsRef, stepsOn] = useFade()
  const [whyRef,   whyOn]   = useFade()
  const heroRef = useRef(null)

  const STATS = [
    { to: 6082, suffix: '',  label: t('estadisticas','stat1'), icon: STATS_ICONS[0] },
    { to: 86,   suffix: '',  label: t('estadisticas','stat2'), icon: STATS_ICONS[1] },
    { to: 90,   suffix: '%', label: t('estadisticas','stat3'), icon: STATS_ICONS[2] },
  ]
  const STEPS = [
    { n: '01', icon: STEPS_ICONS[0], title: t('como_funciona','paso1_titulo'), desc: t('como_funciona','paso1_desc') },
    { n: '02', icon: STEPS_ICONS[1], title: t('como_funciona','paso2_titulo'), desc: t('como_funciona','paso2_desc') },
    { n: '03', icon: STEPS_ICONS[2], title: t('como_funciona','paso3_titulo'), desc: t('como_funciona','paso3_desc') },
  ]
  const REASONS = [
    { icon: REASONS_ICONS[0], title: t('razones','r1_titulo'), desc: t('razones','r1_desc') },
    { icon: REASONS_ICONS[1], title: t('razones','r2_titulo'), desc: t('razones','r2_desc') },
    { icon: REASONS_ICONS[2], title: t('razones','r3_titulo'), desc: t('razones','r3_desc') },
    { icon: REASONS_ICONS[3], title: t('razones','r4_titulo'), desc: t('razones','r4_desc') },
  ]

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    heroRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    heroRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <main style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <section
        className="cv-hero"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (heroRef.current) {
            heroRef.current.style.setProperty('--mouse-x', '-1000px')
            heroRef.current.style.setProperty('--mouse-y', '-1000px')
          }
        }}
        style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#1B3A6B', color: '#FAFAFA', padding: '100px 24px 120px' }}
      >
        <CyberTalaveraBackground />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(244,196,48,0.15)', border: '1px solid rgba(244,196,48,0.3)',
            borderRadius: 100, padding: '5px 16px',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#F4C430', marginBottom: 28,
            animation: 'fadeUp 0.6s ease both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#F4C430', animation: 'dot-blink 2s ease infinite' }} />
            Hackathon Por Amor a Puebla 2026
          </div>

          {/* Slogan — H1 */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
            fontWeight: 800, lineHeight: 1.08,
            margin: '0 0 16px', letterSpacing: '-0.03em',
            maxWidth: 720,
            animation: 'fadeUp 0.7s ease 0.1s both',
          }}>
            La ciudad que todos{' '}
            <span style={{ color: '#F4C430' }}>podemos recorrer.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: '1.1rem', lineHeight: 1.72,
            color: 'rgba(255,255,255,0.72)',
            margin: '0 0 48px', maxWidth: 520,
            animation: 'fadeUp 0.7s ease 0.2s both',
          }}>
            La primera plataforma de transporte intercomunitario rural de Puebla.
            Conectamos pasajeros con transportistas verificados donde el transporte
            formal no llega.
          </p>

          {/* CTAs */}
          <div className="cv-hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', animation: 'fadeUp 0.7s ease 0.3s both' }}>
            <Link to="/buscar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                backgroundColor: '#F4C430', color: '#1B3A6B',
                padding: '14px 28px', borderRadius: 10,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(244,196,48,0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4C430'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <Search size={17} /> {t('hero_landing','buscar_transporte_ahora')}
            </Link>

            <a
              href="https://wa.me/14155238886?text=hola"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Reservar por WhatsApp"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                backgroundColor: '#25D366', color: '#fff',
                padding: '14px 24px', borderRadius: 10,
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1fbe59'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {/* WhatsApp icon */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.549 4.09 1.504 5.8L0 24l6.334-1.487A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.374l-.36-.214-3.727.875.908-3.63-.235-.373A9.818 9.818 0 1 1 12 21.818z"/>
              </svg>
              Reservar por WhatsApp
            </a>

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
              <MapPin size={17} /> {t('navegacion','ver_mapa')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ backgroundColor: '#FAFAFA', padding: '0 24px' }}>
        <div
          ref={statsRef}
          className="cv-stats-grid"
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
                width: 48, height: 48, borderRadius: 12, backgroundColor: '#1B3A6B',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
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

      <hr className="gradient-divider" />

      {/* ══ COMO FUNCIONA ══ */}
      <section ref={stepsRef} className="cv-flowers-bg" style={{ padding: '72px 24px 96px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Como funciona ChulaVia
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
              Simple, rapido y accesible desde cualquier telefono.
            </p>
          </div>

          <div className="cv-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 24 }}>
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} style={{
                backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(27,58,107,0.08)',
                borderRadius: 18, padding: '36px 28px', position: 'relative', overflow: 'hidden',
                opacity: stepsOn ? 1 : 0,
                transform: stepsOn ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <span style={{ position: 'absolute', top: 12, right: 20, fontSize: '3.8rem', fontWeight: 900, lineHeight: 1, color: 'rgba(27,58,107,0.05)', userSelect: 'none' }}>
                  {n}
                </span>
                <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                  <Icon size={24} color="#F4C430" aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1B3A6B', margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.68, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="gradient-divider" />

      {/* ══ POR QUE ══ */}
      <section ref={whyRef} className="cv-flowers-bg" style={{ padding: '96px 24px', backgroundColor: '#f0f3fa' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="cv-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div style={{ opacity: whyOn ? 1 : 0, transform: whyOn ? 'translateX(0)' : 'translateX(-24px)', transition: 'all 0.7s ease' }}>
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1B3A6B', fontWeight: 700, fontSize: 15, textDecoration: 'none', borderBottom: '2px solid #1B3A6B', paddingBottom: 2, transition: 'gap 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.gap = '14px'}
                onMouseLeave={e => e.currentTarget.style.gap = '8px'}
              >
                Ver el mapa de comunidades <ArrowRight size={16} />
              </Link>
            </div>

            <div className="cv-why-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, opacity: whyOn ? 1 : 0, transform: whyOn ? 'translateX(0)' : 'translateX(24px)', transition: 'all 0.7s ease 0.15s' }}>
              {REASONS.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(27,58,107,0.08)',
                  borderRadius: 16, padding: '24px 20px',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,58,107,0.09)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
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

      <hr className="gradient-divider" />

      {/* ══ WHATSAPP DEMO ══ */}
      <section className="cv-flowers-bg" style={{ padding: '96px 24px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="cv-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left: explanation */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                backgroundColor: '#dcfce7', border: '1px solid #bbf7d0',
                borderRadius: 100, padding: '4px 14px',
                fontSize: 11, fontWeight: 700, color: '#15803d',
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                Funciona con cualquier WhatsApp
              </div>

              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 20px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Reserva sin salir de WhatsApp
              </h2>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, margin: '0 0 16px' }}>
                Sin descargar ninguna app. Funciona con <strong style={{ color: '#1B3A6B' }}>2G</strong> y en cualquier teléfono con WhatsApp instalado — incluyendo los más básicos.
              </p>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, margin: 0 }}>
                Ideal para comunidades rurales donde el internet es limitado. Prueba la conversación interactiva a la derecha.
              </p>
            </div>

            {/* Right: phone simulator */}
            <WhatsAppDemo />
          </div>
        </div>
      </section>

      <hr className="gradient-divider" />

      {/* ══ ROADMAP ══ */}
      <section className="cv-flowers-bg" style={{ padding: '96px 24px', backgroundColor: '#f0f3fa' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Hacia donde vamos
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              ChulaVia es el primer paso de una plataforma de movilidad que puede escalar a todo Puebla.
            </p>
          </div>

          <div className="cv-roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              {
                fase: '01', badge: '✓ Hoy', badgeColor: '#dcfce7', badgeText: '#15803d',
                title: 'MVP — Hackathon',
                items: ['App web + PWA instalable en tu celular', 'Bot WhatsApp en Español, Nahuatl y Totonaco', 'Dashboard de datos en tiempo real para el gobierno', 'Transportistas verificados: INE + placa + calificaciones'],
              },
              {
                fase: '02', badge: '30 días', badgeColor: '#FEF9C3', badgeText: '#854D0E',
                title: 'Expansion Regional',
                items: ['80+ comunidades en 5 regiones de Puebla', 'Sistema de reportes de infraestructura vial', 'Paradas intermedias y rutas compartidas', 'SMS fallback para telefonos sin internet'],
              },
              {
                fase: '03', badge: '60-90 días', badgeColor: '#e8edf5', badgeText: '#6b7280',
                title: 'Escala Estatal',
                items: ['217 municipios de Puebla cubiertos', 'Alianza con SMOT y CONAPO para datos oficiales', 'Voz: busca tu ruta sin leer ni escribir', 'API publica de movilidad rural para investigadores'],
              },
            ].map(({ fase, badge, badgeColor, badgeText, title, items }) => (
              <div key={fase} style={{
                backgroundColor: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(27,58,107,0.08)',
                borderRadius: 20, padding: '32px 28px',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#F4C430' }}>{fase}</div>
                  <span style={{ padding: '4px 12px', borderRadius: 100, backgroundColor: badgeColor, color: badgeText, fontSize: 11, fontWeight: 700 }}>{badge}</span>
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

      <hr className="gradient-divider" />

      {/* ══ EQUIPO ══ */}
      <section className="cv-flowers-bg" style={{ padding: '96px 24px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#1B3A6B', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              El equipo
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 380, margin: '0 auto', lineHeight: 1.65 }}>
              Cuatro especialidades, un solo objetivo: conectar a las comunidades rurales de Puebla.
            </p>
          </div>

          <div className="cv-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
            {TEAM.map(({ nombre, rol, tech, foto, iniciales }) => (
              <div key={nombre} style={{
                backgroundColor: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(27,58,107,0.08)',
                borderRadius: 20, padding: '32px 24px', textAlign: 'center',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,58,107,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <PhotoAvatar src={foto} iniciales={iniciales} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B', margin: '0 0 6px' }}>{nombre}</h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#2A6049', margin: '0 0 10px' }}>{rol}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{tech}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 100,
              backgroundColor: '#f0f4ff', border: '1px solid #dde3f0',
              fontSize: 12, fontWeight: 600, color: '#1B3A6B', letterSpacing: '0.03em',
            }}>
              Metodologia Scrum &bull; Sprint de 24 horas &bull; Backlog priorizado
            </span>
          </div>

          {/* Sprint accordion */}
          <SprintAccordion />
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, #1B3A6B 0%, #12284C 100%)',
        textAlign: 'center', color: '#FAFAFA',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#F4C430', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <Users size={28} color="#1B3A6B" aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {t('navegacion','soy_transportista')}
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
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4C430'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Registrarme como transportista <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </main>
  )
}

/* ── Photo avatar with fallback ── */
function PhotoAvatar({ src, iniciales }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div style={{
        width: 80, height: 80, borderRadius: '50%', backgroundColor: '#1B3A6B',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 24, fontWeight: 800, color: '#F4C430',
      }}>{iniciales}</div>
    )
  }
  return (
    <img
      src={src}
      alt={iniciales}
      onError={() => setErr(true)}
      style={{
        width: 80, height: 80, borderRadius: '50%',
        objectFit: 'cover', objectPosition: 'center top',
        margin: '0 auto 20px', display: 'block',
        border: '3px solid #e8edf5',
      }}
    />
  )
}
