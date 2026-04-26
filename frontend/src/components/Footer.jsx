import { Link } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus, MessageCircle, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1B3A6B',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '48px 24px 28px',
      color: 'rgba(255,255,255,0.7)',
    }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: 40,
          alignItems: 'start',
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', marginBottom: 12, backgroundColor: '#fff', padding: 8, borderRadius: 12 }}>
              <img src="/logo.png" alt="ChulaVia" style={{ height: 44, width: 'auto' }} />
            </Link>
            <p style={{ margin: '0 0 6px', fontSize: 13, lineHeight: 1.6, maxWidth: 220, color: 'rgba(255,255,255,0.6)' }}>
              Movilidad rural intercomunitaria de Puebla.
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: '#F4C430', background: 'rgba(244,196,48,0.12)',
              border: '1px solid rgba(244,196,48,0.25)',
              borderRadius: 100, padding: '3px 10px',
            }}>
              Hackathon Por Amor a Puebla 2026
            </span>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', paddingTop: 4 }}>
            {[
              { to: '/buscar',   icon: Search,          label: 'Buscar transporte' },
              { to: '/mapa',     icon: MapPin,           label: 'Mapa de rutas'     },
              { to: '/gobierno', icon: LayoutDashboard,  label: 'Panel Gobierno'    },
              { to: '/unirse',   icon: UserPlus,         label: 'Soy transportista' },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                fontSize: 13, fontWeight: 500,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <a href="https://wa.me" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: '#25D366', color: '#fff',
              padding: '9px 18px', borderRadius: 8,
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,211,102,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <MessageCircle size={14} />
              Contacto WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © 2026 ChulaVía · Puebla, México
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Hecho con <Heart size={11} style={{ color: '#F4C430' }} /> por el equipo ChulaVía
          </p>
        </div>

      </div>
    </footer>
  )
}
