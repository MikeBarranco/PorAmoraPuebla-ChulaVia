import { Link } from 'react-router-dom'
import { MapPin, Search, Star, Shield, BarChart2, MessageCircle, ArrowRight, Users, Route, TrendingUp } from 'lucide-react'

const stats = [
  { value: '15', label: 'comunidades conectadas', icon: MapPin },
  { value: '5', label: 'transportistas verificados', icon: Shield },
  { value: '234', label: 'viajes realizados', icon: Route },
]

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Busca tu ruta',
    desc: 'Escribe de donde sales y a donde vas. Encontramos los transportistas disponibles en tu zona.',
  },
  {
    number: '02',
    icon: Star,
    title: 'Elige tu transporte',
    desc: 'Ve horarios, precios y calificaciones de transportistas verificados por tu comunidad.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Confirma por WhatsApp',
    desc: 'Sin app que instalar. Recibe tu confirmacion directo en WhatsApp, funciona con cualquier telefono.',
  },
]

const reasons = [
  {
    icon: Shield,
    title: 'Transportistas verificados',
    desc: 'INE confirmado, placa registrada y calificaciones reales de tu comunidad.',
  },
  {
    icon: MessageCircle,
    title: 'Funciona con WhatsApp',
    desc: 'Sin smartphone caro ni internet rapido. Solo WhatsApp, que ya tienes.',
  },
  {
    icon: BarChart2,
    title: 'Datos para el gobierno',
    desc: 'Generamos la primera base de datos de movilidad rural de Puebla para informar politica publica.',
  },
  {
    icon: Users,
    title: 'Hecho para tu comunidad',
    desc: 'Disenado para zonas rurales de alta marginacion donde el transporte formal no llega.',
  },
]

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1B3A6B 0%, #0f2347 60%, #1a3560 100%)',
          color: '#FAFAFA',
          padding: '80px 24px 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: 'rgba(193,68,14,0.08)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(42,96,73,0.12)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: '680px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(193,68,14,0.25)',
                color: '#f47a52',
                border: '1px solid rgba(193,68,14,0.4)',
                borderRadius: '100px',
                padding: '4px 14px',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.04em',
                marginBottom: '24px',
                textTransform: 'uppercase',
              }}
            >
              Movilidad rural en Puebla
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                lineHeight: '1.1',
                margin: '0 0 24px',
                letterSpacing: '-0.02em',
              }}
            >
              Conecta tu comunidad.{' '}
              <span style={{ color: '#C1440E' }}>Muevete con confianza.</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: '1.65',
                color: 'rgba(250,250,250,0.78)',
                margin: '0 0 40px',
                maxWidth: '560px',
              }}
            >
              La primera plataforma de transporte intercomunitario rural de Puebla.
              Conectamos pasajeros con transportistas verificados en comunidades donde
              el transporte formal no llega.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/buscar"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#C1440E',
                  color: '#FAFAFA',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(193,68,14,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#a83a0c'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(193,68,14,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#C1440E'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(193,68,14,0.4)'
                }}
              >
                <Search size={18} />
                Buscar transporte
              </Link>

              <Link
                to="/mapa"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#FAFAFA',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                }}
              >
                <MapPin size={18} />
                Ver mapa de rutas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#FAFAFA', padding: '0 24px' }}>
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            transform: 'translateY(-40px)',
            boxShadow: '0 8px 32px rgba(27,58,107,0.12)',
          }}
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              style={{
                backgroundColor: '#FAFAFA',
                padding: '32px 28px',
                textAlign: 'center',
              }}
            >
              <Icon size={24} color="#C1440E" style={{ margin: '0 auto 12px' }} aria-hidden="true" />
              <div
                style={{
                  fontSize: '2.6rem',
                  fontWeight: '800',
                  color: '#1B3A6B',
                  lineHeight: '1',
                  marginBottom: '6px',
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ padding: '32px 24px 80px', backgroundColor: '#FAFAFA' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: '800',
                color: '#1B3A6B',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Como funciona ChulaVia
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
              Simple, rapido y accesible desde cualquier telefono con WhatsApp.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {steps.map(({ number, icon: Icon, title, desc }) => (
              <div
                key={number}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  position: 'relative',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,58,107,0.1)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '24px',
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: 'rgba(27,58,107,0.06)',
                    lineHeight: '1',
                    userSelect: 'none',
                  }}
                >
                  {number}
                </span>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(193,68,14,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={22} color="#C1440E" aria-hidden="true" />
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1B3A6B',
                    margin: '0 0 10px',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que ChulaVia */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#f8f9fb',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: '800',
                  color: '#1B3A6B',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Porque moverse en Puebla es un derecho, no un privilegio
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  margin: '0 0 32px',
                }}
              >
                El 90% del transporte en comunidades de alta marginacion en Mexico es informal.
                Sin rutas fijas, sin seguro, sin datos. ChulaVia digitaliza ese transporte,
                lo hace visible y lo hace seguro.
              </p>
              <Link
                to="/mapa"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#C1440E',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'gap 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '12px'}
                onMouseLeave={e => e.currentTarget.style.gap = '8px'}
              >
                Ver el mapa de comunidades <ArrowRight size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              {reasons.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    padding: '22px 20px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(27,58,107,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={18} color="#1B3A6B" aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 6px' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.55', margin: 0 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, #1B3A6B 0%, #0f2347 100%)',
          textAlign: 'center',
          color: '#FAFAFA',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <TrendingUp size={36} color="#C1440E" style={{ margin: '0 auto 20px' }} aria-hidden="true" />
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '800',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            Eres transportista? Registrate gratis
          </h2>
          <p
            style={{
              color: 'rgba(250,250,250,0.72)',
              fontSize: '15px',
              lineHeight: '1.65',
              margin: '0 0 36px',
            }}
          >
            Llega a mas pasajeros, optimiza tus rutas y forma parte de la primera
            red de transporte rural digital de Puebla.
          </p>
          <Link
            to="/unirse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#C1440E',
              color: '#FAFAFA',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(193,68,14,0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#a83a0c'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#C1440E'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Registrarme como transportista <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#0f2347',
          color: 'rgba(250,250,250,0.5)',
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: '13px',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <img src="/logo.png" alt="ChulaVia" style={{ height: '32px', marginBottom: '12px', opacity: 0.7 }} />
          <p style={{ margin: '0 0 4px' }}>ChulaVia &mdash; Plataforma de movilidad rural intercomunitaria</p>
          <p style={{ margin: 0 }}>Hackathon Por Amor a Puebla 2026 &bull; Eje Movilidad</p>
        </div>
      </footer>
    </main>
  )
}
