import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus, ArrowLeft } from 'lucide-react'
import { useLang, LANGS } from '../context/LangContext.jsx'
import traducciones from '../data/traducciones.json'

const NAV_KEYS = [
  { to: '/mapa',     key: 'ver_mapa',           icon: MapPin          },
  { to: '/buscar',   key: 'buscar_transporte',   icon: Search          },
  { to: '/gobierno', key: 'panel_gobierno',      icon: LayoutDashboard },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { lang, setLang } = useLang()
  const isHome = pathname === '/'
  const t = (key) => traducciones.navegacion[key]?.[lang] ?? traducciones.navegacion[key]?.es

  return (
    <nav
      aria-label="Navegacion principal"
      style={{
        backgroundColor: '#1B3A6B',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 16px rgba(27, 58, 107, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* ── Cyber-Talavera Background (Solo movimiento lateral) ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg width="200%" height="200%" style={{ position: 'absolute', opacity: 0.08, animation: 'cv-pan-nav-horizontal 40s linear infinite' }}>
          <defs>
            <pattern id="nav-talavera-exact" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#F4C430" strokeWidth="0.5" strokeDasharray="4 4" />
              <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="white" strokeWidth="1" />
              <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="3" fill="#F4C430" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nav-talavera-exact)" />
        </svg>
      </div>

      <div
        className="cv-nav-inner"
        style={{
          width: '100%',
          padding: '0 4vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left: back + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Regresar"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, color: '#FAFAFA',
                fontSize: 13, fontWeight: 600,
                padding: '6px 12px', cursor: 'pointer',
                transition: 'all 0.2s ease', minHeight: 36,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              <span className="back-label">Regresar</span>
            </button>
          )}
          <Link to="/" aria-label="ChulaVia - Inicio" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="ChulaVia" style={{ height: '64px', width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
          </Link>
        </div>

        {/* Right: nav links + lang selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ul className="cv-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_KEYS.map(({ to, key, icon: Icon }) => {
              const active = pathname === to
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px 8px 4px 4px',
                      fontSize: '14px', fontWeight: active ? '600' : '500',
                      textDecoration: 'none', minHeight: '44px',
                      transition: 'all 0.2s ease',
                      color: active ? '#FAFAFA' : 'rgba(250,250,250,0.75)',
                      backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                      borderBottom: active ? '2px solid #60A5FA' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FAFAFA' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(250,250,250,0.75)' } }}
                  >
                    <Icon size={15} aria-hidden="true" strokeWidth={2} />
                    <span className="nav-label">{t(key)}</span>
                  </Link>
                </li>
              )
            })}

            <li style={{ marginLeft: '8px' }}>
              <Link
                to="/unirse"
                aria-label="Registrate como transportista"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600',
                  textDecoration: 'none', minHeight: '44px',
                  transition: 'all 0.2s ease',
                  color: '#1B3A6B', backgroundColor: '#F4C430',
                  boxShadow: '0 2px 10px rgba(244,196,48,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8b800'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(244,196,48,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4C430'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(244,196,48,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <UserPlus size={15} aria-hidden="true" strokeWidth={2} />
                <span className="nav-label">{t('soy_transportista')}</span>
              </Link>
            </li>
          </ul>

          {/* Language selector */}
          <div className="cv-lang-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 8 }}>
            <div style={{ display: 'flex', gap: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 3 }}>
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  title={l.full}
                  aria-pressed={lang === l.code}
                  style={{
                    padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                    backgroundColor: lang === l.code ? '#F4C430' : 'transparent',
                    color: lang === l.code ? '#1B3A6B' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {lang !== 'es' && (
              <p style={{
                margin: '3px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.5)',
                textAlign: 'center', lineHeight: 1.3, maxWidth: 120,
              }}>
                Traducción aprox. · IPPI
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cv-pan-nav-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .back-label { display: none; }
          .cv-nav-links { gap: 2px !important; }
          .cv-nav-links a { padding: 8px 10px !important; }
          .cv-lang-wrap { margin-left: 4px !important; }
        }
      `}</style>
    </nav>

  )
}
