import { Link, useLocation } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus } from 'lucide-react'

const links = [
  { to: '/mapa', label: 'Mapa', icon: MapPin },
  { to: '/buscar', label: 'Buscar transporte', icon: Search },
  { to: '/gobierno', label: 'Gobierno', icon: LayoutDashboard },
  { to: '/unirse', label: 'Unirse', icon: UserPlus },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav
      style={{ backgroundColor: '#1B3A6B' }}
      aria-label="Navegacion principal"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="ChulaVia - Inicio">
          <img
            src="/logo-chulaví­a.png"
            alt="ChulaVia"
            className="h-9 w-auto"
          />
        </Link>

        <ul className="flex items-center gap-1 list-none m-0 p-0">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                  style={{
                    color: active ? '#1B3A6B' : '#FAFAFA',
                    backgroundColor: active ? '#F4C430' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
