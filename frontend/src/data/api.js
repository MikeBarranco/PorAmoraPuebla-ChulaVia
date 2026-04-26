const BASE = 'https://poramorapuebla-chulavia-production.up.railway.app'

async function get(path) {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  comunidades:      () => get('/api/comunidades/'),
  rutas:            (origen, destino) => {
    const params = new URLSearchParams()
    if (origen)  params.append('origen',  origen)
    if (destino) params.append('destino', destino)
    return get(`/api/rutas/?${params}`)
  },
  resumen:          () => get('/api/analytics/resumen/'),
  deficit:          () => get('/api/analytics/deficit/'),
  rutasPopulares:   () => get('/api/analytics/rutas-populares/'),
  crearSolicitud:   (data) => fetch(BASE + '/api/solicitudes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  registrarTransportista: (data) => fetch(BASE + '/api/transportistas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  subirFoto: (file) => {
    const form = new FormData()
    form.append('foto', file)
    return fetch(BASE + '/api/subir-foto-transportista/', { method: 'POST', body: form }).then(r => r.json())
  },
  completarSolicitud: (id) =>
    fetch(BASE + `/api/solicitudes/${id}/completar/`, { method: 'POST' }).then(r => r.json()),
}
