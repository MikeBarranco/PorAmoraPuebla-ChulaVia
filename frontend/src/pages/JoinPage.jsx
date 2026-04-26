import { useState, useRef } from 'react'
import { User, Phone, Truck, MapPin, Clock, CheckCircle, Shield, Star, ChevronDown, ArrowRight, Camera } from 'lucide-react'
import { comunidades } from '../data/comunidades'
import { api } from '../data/api'

const BLUE   = '#1B3A6B'
const YELLOW = '#F4C430'
const GREEN  = '#2A6049'
const GRAY   = '#6b7280'

const TIPOS = ['Combi', 'Camioneta Pick-up', 'Mototaxi', 'Autobus pequeno']
const DIAS  = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const HORARIOS_OPC = ['05:00','06:00','06:30','07:00','07:30','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
      {children} {required && <span style={{ color: '#e05252' }}>*</span>}
    </label>
  )
}

function Input({ type = 'text', value, onChange, placeholder, icon: Icon }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      {Icon && (
        <Icon size={16} color={focus ? BLUE : GRAY}
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.2s' }} />
      )}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: Icon ? '12px 14px 12px 40px' : '12px 14px',
          border: `1.5px solid ${focus ? BLUE : '#dde3f0'}`,
          borderRadius: 10, fontSize: 14, color: BLUE,
          outline: 'none', fontFamily: 'inherit',
          backgroundColor: '#fff', transition: 'border-color 0.2s',
        }}
      />
    </div>
  )
}

function SelectInput({ value, onChange, options, placeholder, icon: Icon }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      {Icon && (
        <Icon size={16} color={focus ? BLUE : GRAY}
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      )}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', appearance: 'none', boxSizing: 'border-box',
          padding: Icon ? '12px 40px 12px 40px' : '12px 40px 12px 14px',
          border: `1.5px solid ${focus ? BLUE : '#dde3f0'}`,
          borderRadius: 10, fontSize: 14, color: value ? BLUE : GRAY,
          outline: 'none', fontFamily: 'inherit',
          backgroundColor: '#fff', cursor: 'pointer', transition: 'border-color 0.2s',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} color={GRAY}
        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  )
}

function StepBadge({ n, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700,
        backgroundColor: done ? GREEN : active ? BLUE : '#e8edf5',
        color: done || active ? '#fff' : GRAY,
        transition: 'all 0.3s',
      }}>
        {done ? <CheckCircle size={16} /> : n}
      </div>
      <span style={{ fontSize: 13, fontWeight: active || done ? 600 : 400, color: active || done ? BLUE : GRAY }}>
        {label}
      </span>
    </div>
  )
}

export default function JoinPage() {
  const [step, setStep]     = useState(1)
  const [done, setDone]     = useState(false)

  const [nombre,    setNombre]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [ine,       setIne]       = useState('')
  const [tipo,      setTipo]      = useState('')
  const [capacidad, setCapacidad] = useState('')
  const [placa,     setPlaca]     = useState('')
  const [fotoBase64, setFotoBase64] = useState('')
  const [fotoPreview, setFotoPreview] = useState('')
  const [fotoLoading, setFotoLoading] = useState(false)
  const fotoRef = useRef(null)
  const [origen,    setOrigen]    = useState('')
  const [destinos,  setDestinos]  = useState([])
  const [precio,    setPrecio]    = useState('')
  const [dias,      setDias]      = useState([])
  const [horarios,  setHorarios]  = useState([])

  const comunidadesOpc = comunidades.map(c => c.nombre)

  async function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFotoPreview(URL.createObjectURL(file))
    setFotoLoading(true)
    try {
      const { foto_vehiculo_base64 } = await api.subirFoto(file)
      setFotoBase64(foto_vehiculo_base64 ?? '')
    } catch {
      setFotoBase64('')
    } finally {
      setFotoLoading(false)
    }
  }

  function toggleDia(d) {
    setDias(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }
  function toggleHorario(h) {
    setHorarios(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h])
  }
  function toggleDestino(d) {
    setDestinos(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const step1OK = nombre && telefono && ine.length === 4 && tipo && capacidad && placa
  const step2OK = origen && destinos.length > 0 && precio
  const step3OK = dias.length > 0 && horarios.length > 0

  const steps = [
    { n: 1, label: 'Datos personales' },
    { n: 2, label: 'Tu ruta' },
    { n: 3, label: 'Horarios' },
  ]

  if (done) {
    return (
      <div className="cv-flowers-bg" style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(27,58,107,0.1)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'rgba(42,96,73,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={36} color={GREEN} />
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: BLUE }}>Registro completado</h1>
          <p style={{ margin: '0 0 8px', fontSize: 15, color: GRAY, lineHeight: 1.65 }}>
            Bienvenido a ChulaVia, <strong style={{ color: BLUE }}>{nombre}</strong>.
          </p>
          <p style={{ margin: '0 0 32px', fontSize: 14, color: GRAY, lineHeight: 1.65 }}>
            Tu perfil esta en revision. Te contactaremos por WhatsApp al <strong style={{ color: BLUE }}>{telefono}</strong> en las proximas horas para verificar tu INE y placa.
          </p>

          <div style={{ backgroundColor: '#f4f6fb', borderRadius: 14, padding: '20px', marginBottom: 28, textAlign: 'left' }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: BLUE }}>Resumen de tu ruta</p>
            {[
              ['Vehiculo',  `${tipo} &bull; ${capacidad} lugares`],
              ['Placa',     placa],
              ['Ruta',      `${origen} → ${destinos.join(', ')}`],
              ['Precio',    `$${precio} por persona`],
              ['Dias',      dias.join(', ')],
              ['Horarios',  horarios.join(', ')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: GRAY, minWidth: 80, flexShrink: 0 }}>{k}:</span>
                <span style={{ color: BLUE, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: v }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/buscar" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              backgroundColor: '#f4f6fb', color: BLUE,
              padding: '12px', borderRadius: 10, textDecoration: 'none',
              fontWeight: 600, fontSize: 14, border: '1.5px solid #dde3f0',
            }}>
              Ver rutas
            </a>
            <a href="/" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              backgroundColor: YELLOW, color: BLUE,
              padding: '12px', borderRadius: 10, textDecoration: 'none',
              fontWeight: 700, fontSize: 14,
            }}>
              Inicio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cv-flowers-bg" style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: '#f4f6fb' }}>

      {/* Header */}
      <div className="cv-cyber-bg" style={{ backgroundColor: '#1B3A6B', padding: '40px 24px 32px', position: 'relative', overflow: 'hidden' }}>

        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Eres transportista? Registrate gratis
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, margin: 0 }}>
            Gratis &bull; Verificacion en 24 horas &bull; Mas pasajeros para ti
          </p>
        </div>
      </div>

      <div className="cv-join-card" style={{ maxWidth: '820px', margin: '40px auto 0', padding: '0 24px 64px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(27,58,107,0.1)', overflow: 'hidden' }}>

          {/* Progress steps */}
          <div style={{ padding: '28px 32px', borderBottom: '1px solid #f0f2f5', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StepBadge n={s.n} label={s.label} active={step === s.n} done={step > s.n} />
                {i < steps.length - 1 && (
                  <div style={{ width: 32, height: 1, backgroundColor: step > s.n ? GREEN : '#e8edf5' }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '32px' }}>

            {/* ── Step 1: Datos personales ── */}
            {step === 1 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: BLUE }}>Tus datos personales</h2>
                <p style={{ margin: '0 0 28px', fontSize: 14, color: GRAY }}>Necesitamos verificar tu identidad para proteger a los pasajeros.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <Label required>Nombre completo</Label>
                    <Input value={nombre} onChange={setNombre} placeholder="Ej. Maria Guadalupe Flores" icon={User} />
                  </div>

                  <div>
                    <Label required>Numero de telefono (WhatsApp)</Label>
                    <Input type="tel" value={telefono} onChange={setTelefono} placeholder="Ej. 2221234567" icon={Phone} />
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: GRAY }}>Te enviaremos un codigo de verificacion por SMS.</p>
                  </div>

                  <div>
                    <Label required>Ultimos 4 digitos de tu INE</Label>
                    <Input value={ine} onChange={v => setIne(v.slice(0, 4))} placeholder="Ej. 4521" icon={Shield} />
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: GRAY }}>Solo guardamos los ultimos 4 digitos. Tu INE no se almacena completo.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <Label required>Tipo de vehiculo</Label>
                      <SelectInput value={tipo} onChange={setTipo} options={TIPOS} placeholder="Selecciona" icon={Truck} />
                    </div>
                    <div>
                      <Label required>Capacidad (personas)</Label>
                      <Input type="number" value={capacidad} onChange={setCapacidad} placeholder="Ej. 12" />
                    </div>
                  </div>

                  <div>
                    <Label required>Placa del vehiculo</Label>
                    <Input value={placa} onChange={v => setPlaca(v.toUpperCase())} placeholder="Ej. PBL-123" icon={Truck} />
                  </div>
                </div>

                {/* Foto del vehiculo */}
                <div style={{ marginTop: 20 }}>
                  <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: BLUE }}>
                    Foto del vehiculo <span style={{ fontWeight: 400, color: GRAY }}>(opcional)</span>
                  </p>
                  <input ref={fotoRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} aria-label="Subir foto del vehiculo" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                      type="button"
                      onClick={() => fotoRef.current?.click()}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px', borderRadius: 10,
                        border: '1.5px dashed #dde3f0', backgroundColor: '#f9fafc',
                        fontSize: 13, fontWeight: 600, color: BLUE, cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = BLUE}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#dde3f0'}
                    >
                      <Camera size={15} />
                      {fotoLoading ? 'Subiendo...' : fotoPreview ? 'Cambiar foto' : 'Subir foto'}
                    </button>
                    {fotoPreview && (
                      <img
                        src={fotoPreview}
                        alt="Vista previa del vehiculo"
                        style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: '2px solid #e0e7f0' }}
                      />
                    )}
                  </div>
                </div>

                {/* Seguridad info */}
                <div style={{ marginTop: 24, padding: '16px', backgroundColor: 'rgba(42,96,73,0.06)', borderRadius: 12, border: '1px solid rgba(42,96,73,0.15)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Shield size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: GREEN }}>Tu informacion esta segura</p>
                      <p style={{ margin: 0, fontSize: 12, color: GRAY, lineHeight: 1.55 }}>
                        Solo compartimos tu nombre y telefono con pasajeros que confirman un viaje.
                        Tu INE y placa son para verificacion interna.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Ruta ── */}
            {step === 2 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: BLUE }}>Tu ruta habitual</h2>
                <p style={{ margin: '0 0 28px', fontSize: 14, color: GRAY }}>Define de donde sales y a donde llevas pasajeros normalmente.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <Label required>Comunidad de origen (donde sales)</Label>
                    <SelectInput value={origen} onChange={setOrigen} options={comunidadesOpc} placeholder="Selecciona tu comunidad" icon={MapPin} />
                  </div>

                  <div>
                    <Label required>Destinos que cubres</Label>
                    <p style={{ margin: '0 0 10px', fontSize: 12, color: GRAY }}>Selecciona todas las comunidades a las que llevas pasajeros.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {comunidadesOpc.filter(c => c !== origen).map(c => (
                        <button key={c} onClick={() => toggleDestino(c)}
                          style={{
                            padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.15s', border: '1.5px solid',
                            borderColor: destinos.includes(c) ? BLUE : '#dde3f0',
                            backgroundColor: destinos.includes(c) ? BLUE : '#fff',
                            color: destinos.includes(c) ? '#fff' : GRAY,
                          }}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {destinos.length > 0 && (
                      <p style={{ margin: '8px 0 0', fontSize: 12, color: GREEN, fontWeight: 500 }}>
                        {destinos.length} destino{destinos.length > 1 ? 's' : ''} seleccionado{destinos.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label required>Precio por persona (pesos MXN)</Label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, fontWeight: 600, color: GRAY }}>$</span>
                      <input type="number" value={precio} onChange={e => setPrecio(e.target.value)}
                        placeholder="Ej. 35"
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '12px 14px 12px 28px', borderRadius: 10,
                          border: '1.5px solid #dde3f0', fontSize: 14, color: BLUE,
                          outline: 'none', fontFamily: 'inherit',
                        }}
                        onFocus={e => e.target.style.borderColor = BLUE}
                        onBlur={e => e.target.style.borderColor = '#dde3f0'}
                      />
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: GRAY }}>Precio promedio en la region: $25–$45 MXN.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Horarios ── */}
            {step === 3 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: BLUE }}>Dias y horarios</h2>
                <p style={{ margin: '0 0 28px', fontSize: 14, color: GRAY }}>Cuando ofreces tu servicio. Los pasajeros veran esto al buscar.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <Label required>Dias que trabajas</Label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {DIAS.map(d => (
                        <button key={d} onClick={() => toggleDia(d)}
                          style={{
                            width: 52, height: 52, borderRadius: 12, border: '1.5px solid',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                            borderColor: dias.includes(d) ? BLUE : '#dde3f0',
                            backgroundColor: dias.includes(d) ? BLUE : '#fff',
                            color: dias.includes(d) ? '#fff' : GRAY,
                          }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label required>Horarios de salida</Label>
                    <p style={{ margin: '0 0 10px', fontSize: 12, color: GRAY }}>Selecciona a que horas sueles salir.</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {HORARIOS_OPC.map(h => (
                        <button key={h} onClick={() => toggleHorario(h)}
                          style={{
                            padding: '8px 14px', borderRadius: 8, border: '1.5px solid',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                            borderColor: horarios.includes(h) ? BLUE : '#dde3f0',
                            backgroundColor: horarios.includes(h) ? BLUE : '#fff',
                            color: horarios.includes(h) ? '#fff' : GRAY,
                          }}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  {(dias.length > 0 || horarios.length > 0) && (
                    <div style={{ backgroundColor: '#f4f6fb', borderRadius: 14, padding: '20px', border: '1px solid #e8edf5' }}>
                      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: BLUE }}>Como apareceran tus datos</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ color: GRAY, minWidth: 80 }}>Ruta:</span>
                          <span style={{ color: BLUE, fontWeight: 500 }}>{origen} → {destinos.slice(0,2).join(', ')}{destinos.length > 2 ? '...' : ''}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ color: GRAY, minWidth: 80 }}>Precio:</span>
                          <span style={{ color: BLUE, fontWeight: 500 }}>${precio} por persona</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ color: GRAY, minWidth: 80 }}>Dias:</span>
                          <span style={{ color: BLUE, fontWeight: 500 }}>{dias.join(', ')}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ color: GRAY, minWidth: 80 }}>Horarios:</span>
                          <span style={{ color: BLUE, fontWeight: 500 }}>{horarios.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones navegacion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f2f5' }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)}
                  style={{
                    padding: '12px 24px', borderRadius: 10, border: '1.5px solid #dde3f0',
                    backgroundColor: '#fff', color: BLUE, fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}>
                  Atras
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 ? !step1OK : !step2OK}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 10, border: 'none',
                    backgroundColor: (step === 1 ? step1OK : step2OK) ? YELLOW : '#e5e7eb',
                    color: (step === 1 ? step1OK : step2OK) ? BLUE : '#9ca3af',
                    fontWeight: 700, fontSize: 14,
                    cursor: (step === 1 ? step1OK : step2OK) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}>
                  Siguiente <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!step3OK) return
                    api.registrarTransportista({
                      nombre, telefono, ine_ultimos_4: ine,
                      tipo_vehiculo: tipo.toLowerCase().replace(/ /g, '_').replace('-', '_'),
                      capacidad: parseInt(capacidad),
                      placa, foto_vehiculo_url: fotoBase64,
                    }).catch(() => {})
                    setDone(true)
                  }}
                  disabled={!step3OK}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 10, border: 'none',
                    backgroundColor: step3OK ? BLUE : '#e5e7eb',
                    color: step3OK ? '#fff' : '#9ca3af',
                    fontWeight: 700, fontSize: 14,
                    cursor: step3OK ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}>
                  <CheckCircle size={16} /> Completar registro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
          {[
            { icon: Star,   title: 'Mas pasajeros',     desc: 'Los pasajeros te encuentran cuando buscan tu ruta.' },
            { icon: Shield, title: 'Perfil verificado',  desc: 'El badge de verificado genera mas confianza y reservaciones.' },
            { icon: Truck,  title: '100% gratis',        desc: 'Sin costo durante el periodo de lanzamiento en Puebla.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #e8edf5', display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: BLUE + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={BLUE} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: BLUE }}>{title}</p>
                <p style={{ margin: 0, fontSize: 12, color: GRAY, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
