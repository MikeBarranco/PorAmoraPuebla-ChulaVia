import { Link, useLocation } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus } from 'lucide-react'

const links = [
  { to: '/mapa', label: 'Mapa', icon: MapPin },
  { to: '/buscar', label: 'Buscar transporte', icon: Search },
  { to: '/gobierno', label: 'Gobierno', icon: LayoutDashboard },
]

export default function Navbar() {
  const { pathname } = useLocation()

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
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        <Link
          to="/"
          aria-label="ChulaVia - Inicio"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img
            src="/logo.png"
            alt="ChulaVia"
            style={{ height: '52px', width: 'auto' }}
          />
        </Link>

        <ul style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
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
              <span>Soy transportista</span>
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .nav-label { display: none; }
        }
      `}</style>
    </nav>
  )
}
