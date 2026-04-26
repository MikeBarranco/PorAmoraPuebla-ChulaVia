import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { MapPin, Shield, Route, Users, AlertTriangle, TrendingUp, Download } from 'lucide-react'
import { comunidades, rutas } from '../data/comunidades'
import { api } from '../data/api'

const BLUE   = '#1B3A6B'
const YELLOW = '#F4C430'
const GREEN  = '#2A6049'
const RED    = '#C1440E'
const GRAY   = '#6b7280'

/* ── KPI card ── */
function KpiCard({ icon: Icon, value, label, sub, color = BLUE }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: 16, padding: '24px',
      border: '1px solid #e8edf5',
      display: 'flex', alignItems: 'flex-start', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        backgroundColor: color + '14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color={color} aria-hidden="true" />
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '1.9rem', fontWeight: 800, color: BLUE, lineHeight: 1 }}>{value}</p>
        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: BLUE }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: 12, color: GRAY }}>{sub}</p>}
      </div>
    </div>
  )
}

/* ── Section title ── */
function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 700, color: BLUE, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      {children}
    </h2>
  )
}

/* ── Data derivada ── */
const sinCobertura = comunidades.filter(c => !c.tieneTransporte)
const conCobertura = comunidades.filter(c =>  c.tieneTransporte)

const demandaData = [
  { nombre: 'San Pablo Anicano',      solicitudes: 12 },
  { nombre: 'San Jeronimo Xayac.',    solicitudes: 9  },
  { nombre: 'Santa Ana Coatlichan',   solicitudes: 7  },
  { nombre: 'Tilapa',                 solicitudes: 6  },
  { nombre: 'San Pablo Ahuatempan',   solicitudes: 5  },
]

const tiposVehiculo = [
  { name: 'Combi',     value: 2, color: BLUE   },
  { name: 'Camioneta', value: 2, color: '#2563EB' },
  { name: 'Mototaxi',  value: 1, color: GREEN  },
]

const rutasData = rutas.map(r => ({
  nombre: `${r.origen.split(' ')[0]} → ${r.destino.split(' ')[0]}`,
  viajes: r.totalViajes,
  calificacion: r.calificacion,
})).sort((a, b) => b.viajes - a.viajes)

const coberturaPie = [
  { name: 'Con transporte',  value: conCobertura.length,  color: GREEN },
  { name: 'Sin transporte',  value: sinCobertura.length,  color: RED   },
]

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #e8edf5', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: BLUE }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: 0, fontSize: 13, color: GRAY }}>{p.name}: <strong style={{ color: BLUE }}>{p.value}</strong></p>
      ))}
    </div>
  )
}

export default function GovDashboard() {
  const [tab, setTab]         = useState('resumen')
  const [resumen, setResumen] = useState(null)

  useEffect(() => {
    api.resumen()
      .then(setResumen)
      .catch(() => setResumen(null))
  }, [])

  const tabs = [
    { id: 'resumen',      label: 'Resumen general' },
    { id: 'cobertura',    label: 'Cobertura' },
    { id: 'transportistas', label: 'Transportistas' },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f4f6fb' }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: BLUE, padding: '40px 24px 56px', position: 'relative', overflow: 'hidden' }}>
        <svg width="180" height="180" viewBox="0 0 120 120" fill="none"
          style={{ position: 'absolute', right: -20, top: -20, opacity: 0.06, pointerEvents: 'none' }}
          aria-hidden="true">
          <ellipse cx="60" cy="22" rx="11" ry="20" fill="white"/>
          <ellipse cx="60" cy="98" rx="11" ry="20" fill="white"/>
          <ellipse cx="22" cy="60" rx="20" ry="11" fill="white"/>
          <ellipse cx="98" cy="60" rx="20" ry="11" fill="white"/>
          <circle cx="60" cy="60" r="13" fill="white"/>
          <rect x="8" y="8" width="104" height="104" rx="6" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>

        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{
                display: 'inline-block', backgroundColor: 'rgba(244,196,48,0.15)',
                border: '1px solid rgba(244,196,48,0.3)', borderRadius: 100,
                padding: '4px 14px', fontSize: 11, fontWeight: 600,
                color: YELLOW, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12,
              }}>
                Panel gubernamental
              </span>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Dashboard de Movilidad Rural
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, margin: 0 }}>
                Puebla &bull; Datos en tiempo real &bull; ChulaVia 2026
              </p>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 10,
              padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              <Download size={16} /> Exportar reporte
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 32 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '9px 18px', borderRadius: '8px 8px 0 0', border: 'none',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                  backgroundColor: tab === t.id ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: tab === t.id ? BLUE : 'rgba(255,255,255,0.8)',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div style={{ maxWidth: '72rem', margin: '-2px auto 0', padding: '32px 24px 64px' }}>

        {/* ══ TAB: Resumen ══ */}
        {tab === 'resumen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
              <KpiCard icon={MapPin}        value={resumen?.total_comunidades      ?? comunidades.length}   label="Comunidades registradas"    sub={`${sinCobertura.length} sin cobertura`} color={BLUE}   />
              <KpiCard icon={Shield}        value={resumen?.total_transportistas  ?? 5}                    label="Transportistas activos"     sub="Verificados por ChulaVia"               color={GREEN}  />
              <KpiCard icon={Route}         value={resumen?.total_rutas           ?? rutas.length}         label="Rutas activas"              sub="Region Mixteca"                         color={BLUE}   />
              <KpiCard icon={TrendingUp}    value={resumen?.total_solicitudes     ?? 34}                   label="Solicitudes registradas"    sub="Demanda documentada"                    color={GREEN}  />
              <KpiCard icon={AlertTriangle} value={sinCobertura.length}                                    label="Comunidades sin cobertura"  sub="Demanda sin satisfacer"                 color={RED}    />
              <KpiCard icon={Users}         value={resumen?.viajes_completados    ?? 0}                    label="Viajes completados"         sub="Acumulado 2026"                         color={YELLOW} />
            </div>

            {/* Graficas fila 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Rutas por viajes */}
              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
                <SectionTitle><TrendingUp size={16} color={BLUE} /> Rutas mas utilizadas</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={rutasData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: GRAY }} />
                    <YAxis tick={{ fontSize: 11, fill: GRAY }} />
                    <Tooltip content={<CUSTOM_TOOLTIP />} />
                    <Bar dataKey="viajes" name="Viajes" fill={BLUE} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cobertura pie */}
              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
                <SectionTitle><MapPin size={16} color={BLUE} /> Cobertura de transporte</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={coberturaPie}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={90}
                      paddingAngle={3} dataKey="value"
                    >
                      {coberturaPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={10}
                      formatter={v => <span style={{ fontSize: 13, color: GRAY }}>{v}</span>}
                    />
                    <Tooltip formatter={(v, n) => [`${v} comunidades`, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerta deficit */}
            <div style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 24,
              border: '1.5px solid rgba(193,68,14,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(193,68,14,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} color={RED} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: BLUE }}>Comunidades con mayor deficit de movilidad</h2>
                  <p style={{ margin: 0, fontSize: 12, color: GRAY }}>Solicitudes registradas sin ruta disponible &mdash; oportunidades de inversion en infraestructura</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {demandaData.map((d, i) => (
                  <div key={d.nombre} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: GRAY, width: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 14, color: BLUE, fontWeight: 500, flex: 1, minWidth: 0 }}>{d.nombre}</span>
                    <div style={{ width: 160, height: 8, backgroundColor: '#f0f2f5', borderRadius: 100, flexShrink: 0, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        width: `${(d.solicitudes / demandaData[0].solicitudes) * 100}%`,
                        backgroundColor: RED,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: RED, width: 32, textAlign: 'right', flexShrink: 0 }}>{d.solicitudes}</span>
                  </div>
                ))}
              </div>

              <p style={{ margin: '20px 0 0', fontSize: 12, color: GRAY, borderTop: '1px solid #f0f2f5', paddingTop: 16 }}>
                Fuente: solicitudes registradas por ChulaVia &bull; Alineado con PED 2024-2030 Accion 4.3.1.4
              </p>
            </div>
          </div>
        )}

        {/* ══ TAB: Cobertura ══ */}
        {tab === 'cobertura' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
              <KpiCard icon={MapPin}       value={comunidades.length}   label="Total de comunidades"      color={BLUE}  />
              <KpiCard icon={Shield}       value={conCobertura.length}  label="Con transporte formal"     sub={`${Math.round(conCobertura.length/comunidades.length*100)}% de cobertura`} color={GREEN} />
              <KpiCard icon={AlertTriangle} value={sinCobertura.length} label="Sin transporte formal"     sub={`${Math.round(sinCobertura.length/comunidades.length*100)}% de deficit`}  color={RED}   />
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
              <SectionTitle><AlertTriangle size={16} color={RED} /> Comunidades sin cobertura</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
                {sinCobertura.map(c => (
                  <div key={c.id} style={{
                    padding: '14px 16px', borderRadius: 12,
                    border: '1px solid rgba(193,68,14,0.15)',
                    backgroundColor: 'rgba(193,68,14,0.04)',
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: BLUE }}>{c.nombre}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: GRAY }}>{c.municipio}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: GRAY }}>{c.poblacion.toLocaleString()} hab.</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: RED, backgroundColor: 'rgba(193,68,14,0.1)', padding: '2px 8px', borderRadius: 100 }}>
                        Sin cobertura
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
              <SectionTitle><Shield size={16} color={GREEN} /> Comunidades con cobertura</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
                {conCobertura.map(c => (
                  <div key={c.id} style={{
                    padding: '14px 16px', borderRadius: 12,
                    border: '1px solid rgba(42,96,73,0.15)',
                    backgroundColor: 'rgba(42,96,73,0.04)',
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: BLUE }}>{c.nombre}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: GRAY }}>{c.municipio}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: GRAY }}>{c.poblacion.toLocaleString()} hab.</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: GREEN, backgroundColor: 'rgba(42,96,73,0.1)', padding: '2px 8px', borderRadius: 100 }}>
                        Con cobertura
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: Transportistas ══ */}
        {tab === 'transportistas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
              <KpiCard icon={Users}  value="5"     label="Transportistas registrados" color={BLUE}  />
              <KpiCard icon={Shield} value="4"     label="Transportistas verificados" sub="80% del total" color={GREEN} />
              <KpiCard icon={Route}  value="234"   label="Viajes acumulados"          color={BLUE}  />
              <KpiCard icon={TrendingUp} value="4.6" label="Calificacion promedio"    sub="Sobre 5.0"     color={GREEN} />
            </div>

            {/* Tipos de vehiculo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
                <SectionTitle><Users size={16} color={BLUE} /> Tipos de vehiculo</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={tiposVehiculo} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                      {tiposVehiculo.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10}
                      formatter={v => <span style={{ fontSize: 13, color: GRAY }}>{v}</span>}
                    />
                    <Tooltip formatter={(v, n) => [`${v} unidades`, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
                <SectionTitle><TrendingUp size={16} color={BLUE} /> Viajes por ruta</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={rutasData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: GRAY }} />
                    <YAxis tick={{ fontSize: 11, fill: GRAY }} />
                    <Tooltip content={<CUSTOM_TOOLTIP />} />
                    <Bar dataKey="viajes" name="Viajes" fill={GREEN} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lista transportistas */}
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf5' }}>
              <SectionTitle><Shield size={16} color={BLUE} /> Registro de transportistas</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { nombre: 'Ernesto Garcia Lopez',      tipo: 'Combi',     viajes: 145, cal: 4.8, verificado: true  },
                  { nombre: 'Maria Guadalupe Flores',    tipo: 'Camioneta', viajes: 89,  cal: 4.6, verificado: true  },
                  { nombre: 'Jose Antonio Reyes',        tipo: 'Mototaxi',  viajes: 234, cal: 4.9, verificado: true  },
                  { nombre: 'Transportes Rivera e Hijos',tipo: 'Camioneta', viajes: 67,  cal: 4.5, verificado: true  },
                  { nombre: 'Roberto Sanchez Mendez',    tipo: 'Combi',     viajes: 42,  cal: 4.3, verificado: false },
                ].map((t, i, arr) => (
                  <div key={t.nombre} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #f0f2f5' : 'none',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: BLUE + '14',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: BLUE,
                    }}>
                      {t.nombre[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: BLUE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.nombre}</p>
                      <p style={{ margin: 0, fontSize: 12, color: GRAY }}>{t.tipo} &bull; {t.viajes} viajes</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: BLUE }}>★ {t.cal}</p>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                        backgroundColor: t.verificado ? 'rgba(42,96,73,0.1)' : 'rgba(107,114,128,0.1)',
                        color: t.verificado ? GREEN : GRAY,
                      }}>
                        {t.verificado ? 'Verificado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
