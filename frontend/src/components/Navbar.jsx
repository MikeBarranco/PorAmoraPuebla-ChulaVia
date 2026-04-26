import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus, ArrowLeft } from 'lucide-react'

const links = [
  { to: '/mapa', label: 'Mapa', icon: MapPin },
  { to: '/buscar', label: 'Buscar transporte', icon: Search },
  { to: '/gobierno', label: 'Gobierno', icon: LayoutDashboard },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'

  return (
    <nav
      className="cv-cyber-bg"
      aria-label="Navegacion principal"
      style={{
        backgroundColor: '#1B3A6B',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 16px rgba(27, 58, 107, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="cv-nav-inner"
        style={{
          width: '100%',
          padding: '0 4vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
        }}
      >
        {/* Flecha de regreso — visible en todas las páginas menos Inicio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Regresar"
              title="Regresar"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: 36,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              <span className="back-label">Regresar</span>
            </button>
          )}

          <Link
            to="/"
            aria-label="ChulaVia - Inicio"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="ChulaVia"
              style={{ height: '64px', width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
            />
          </Link>
        </div>

        <ul className="cv-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: active ? '600' : '500',
                    textDecoration: 'none',
                    minHeight: '44px',
                    transition: 'all 0.2s ease',
                    color: active ? '#FAFAFA' : 'rgba(250,250,250,0.75)',
                    backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                    borderBottom: active ? '2px solid #60A5FA' : '2px solid transparent',
                    borderRadius: '8px 8px 4px 4px',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = '#FAFAFA'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'rgba(250,250,250,0.75)'
                    }
                  }}
                >
                  <Icon size={15} aria-hidden="true" strokeWidth={2} />
                  <span className="nav-label">{label}</span>
                </Link>
              </li>
            )
          })}

          <li style={{ marginLeft: '12px' }}>
            <Link
              to="/unirse"
              aria-label="Registrate como transportista"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                minHeight: '44px',
                transition: 'all 0.2s ease',
                color: '#1B3A6B',
                backgroundColor: '#F4C430',
                boxShadow: '0 2px 10px rgba(244,196,48,0.35)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#e8b800'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(244,196,48,0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#F4C430'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(244,196,48,0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <UserPlus size={15} aria-hidden="true" strokeWidth={2} />
              <span>¿Eres Transportista?</span>
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .back-label { display: none; }
          .cv-nav-links { gap: 2px !important; }
          .cv-nav-links a { padding: 8px 10px !important; }
        }
      `}</style>
    </nav>
  )
}
