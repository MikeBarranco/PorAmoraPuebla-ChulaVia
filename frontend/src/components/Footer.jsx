import { Link } from 'react-router-dom'
import { MapPin, Search, LayoutDashboard, UserPlus, MessageCircle, Heart, Mail } from 'lucide-react'

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1B3A6B',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '48px 24px 28px',
      color: 'rgba(255,255,255,0.7)',
    }}>
      <style>{`
        .cv-footer-top {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 40px;
          align-items: start;
          margin-bottom: 40px;
        }
        .cv-footer-nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          padding-top: 4px;
        }
        .cv-footer-contact {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }
        @media (max-width: 640px) {
          .cv-footer-top {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .cv-footer-nav {
            justify-content: flex-start !important;
          }
          .cv-footer-contact {
            align-items: flex-start !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Top row */}
        <div className="cv-footer-top">

          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', marginBottom: 12, backgroundColor: '#fff', padding: 8, borderRadius: 12 }}>
              <img src="/logo.png" alt="ChulaVia" style={{ height: 44, width: 'auto' }} />
            </Link>
            <p style={{ margin: '0 0 6px', fontSize: 13, lineHeight: 1.6, maxWidth: 220, color: 'rgba(255,255,255,0.6)' }}>
              La ciudad que todos podemos recorrer.
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
          <nav aria-label="Footer navigation" className="cv-footer-nav">
            {[
              { to: '/buscar',   icon: Search,          label: 'Buscar transporte' },
              { to: '/mapa',     icon: MapPin,           label: 'Mapa de rutas'     },
              { to: '/gobierno', icon: LayoutDashboard,  label: 'Panel Gobierno'    },
              { to: '/unirse',   icon: UserPlus,         label: '¿Eres Transportista?' },
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

          {/* Contact + Social */}
          <div className="cv-footer-contact">
            <a href="https://wa.me/14155238886?text=hola" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: '#25D366', color: '#fff',
              padding: '9px 18px', borderRadius: 8,
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,211,102,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <MessageCircle size={14} />
              Contacto WhatsApp
            </a>

            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[
                { href: 'https://www.instagram.com/poramorapuebla.chulavia/', label: 'Instagram ChulaVia', icon: <IconInstagram />, hover: '#E1306C' },
                { href: 'https://web.facebook.com/profile.php?id=61560493651891', label: 'Facebook ChulaVia', icon: <IconFacebook />, hover: '#1877F2' },
                { href: 'mailto:poramorapuebla.chulavia@gmail.com', label: 'Correo ChulaVia', icon: <Mail size={22} />, hover: '#fff' },
              ].map(({ href, label, icon, hover }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 44, height: 44, borderRadius: 10,
                    color: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = hover; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                >{icon}</a>
              ))}
            </div>
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
            Hecho con <Heart size={11} style={{ color: '#F4C430' }} /> por el equipo CuboLobos
          </p>
        </div>

      </div>
    </footer>
  )
}
