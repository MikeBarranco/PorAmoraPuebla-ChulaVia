# ChulaVía — Plataforma de Movilidad Rural de Puebla

> **Hackathon Por Amor a Puebla 2026** · Eje: Movilidad · Reto: Rural Intercomunitario

**La primera plataforma de datos y orquestación de transporte intercomunitario rural del estado de Puebla.**

[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://chulavía.vercel.app)
[![Backend](https://img.shields.io/badge/API-Railway-blue?logo=railway)](https://chulavía.railway.app/api/)
[![WhatsApp](https://img.shields.io/badge/Bot-WhatsApp-25D366?logo=whatsapp)](https://wa.me/14155238886?text=hola)

---

## El Problema

La **Auditoría Superior de la Federación** documentó que las secretarías de Estado no pueden cuantificar cuántas localidades rurales están desconectadas del transporte — porque **no existe ningún censo**. ChulaVía crea ese censo.

- **6,082** localidades rurales en Puebla sin transporte formal registrado
- **86** municipios de alta marginación donde el transporte es 100% informal
- **90%** del transporte en zonas rurales de alta marginación es informal: sin seguro, sin ruta fija, sin datos

El sistema de movilidad urbana de Puebla (RUTA, SIMPUEBLA, Yankuilotl) existe y funciona. **Lo rural es el único vacío real** que el propio PED 2024–2030 reconoce y aún no tiene respuesta digital.

---

## La Solución

ChulaVía digitaliza el transporte informal intercomunitario en **tres capas simultáneas**:

| Capa | Usuario | Qué resuelve |
|------|---------|--------------|
| **Ciudadano** | Pasajeros rurales | Buscar y reservar transporte verificado desde WhatsApp |
| **Transportista** | Combis, camionetas, mototaxis | Registrar ruta, recibir solicitudes, aumentar ocupación |
| **Gobierno** | Secretaría de Movilidad, CONAPO | Dashboard con datos de demanda y déficit en tiempo real |

---

## Funcionalidades

### Para el ciudadano
- **Búsqueda de rutas** — Selecciona origen y destino entre comunidades de la región Mixteca
- **Transportistas verificados** — INE confirmado, placa registrada, calificaciones reales de pasajeros
- **Reservación por WhatsApp** — Sin app que instalar. Funciona con 2G en cualquier teléfono
- **Simulador interactivo** — Demo visual del bot en la landing page

### Para el transportista
- **Registro en 3 pasos** — Datos personales, ruta habitual y horarios
- **Foto del vehículo** — Subida directa desde el formulario
- **Badge verificado** — Genera confianza y más reservaciones

### Para el gobierno
- **Dashboard en tiempo real** — KPIs de comunidades, rutas, transportistas y solicitudes
- **Mapa de cobertura** — 691 comunidades visualizadas con estado de cobertura
- **Déficit de movilidad** — Solicitudes sin ruta disponible = oportunidades de inversión
- **Alineado con el PED 2024–2030** — Líneas de acción 4.3.1.1 y 4.3.1.4

### Internacionalización
- **Español** · **Náhuatl** · **Totonaco** — Todas las páginas cambian de idioma al instante
- Traducciones en proceso de validación con el Instituto Poblano de los Pueblos Indígenas

---

## Stack Tecnológico

### Frontend
```
React 18 + Vite          — SPA con Hot Module Replacement
Leaflet.js               — Mapa interactivo con 691 comunidades rurales
Recharts                 — Gráficas del dashboard de gobierno
React Router v6          — Navegación entre 5 páginas
Context API (LangContext) — i18n: Español, Náhuatl, Totonaco
Vercel                   — Deploy automático desde main branch
```

### Backend
```
Django 4.2 + DRF         — API REST con 9 endpoints
PostgreSQL (Supabase)    — Base de datos geoespacial de movilidad rural
Twilio                   — Bot de WhatsApp + SMS OTP
Pillow                   — Compresión de fotos de vehículos
Railway                  — Deploy del backend con gunicorn
```

### Datos
```
INEGI Censo 2020         — Base de las 6,082 localidades rurales
CONAPO Marginación 2020  — Clasificación de municipios de alta marginación
Instituto Mexicano del Transporte — Estadística del 90% informal
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                 USUARIO RURAL                        │
│   WhatsApp 2G ──► Bot Twilio ──► Django API          │
│   Navegador   ──► React SPA  ──► Django API          │
└─────────────────────────────────────────────────────┘
              │                          │
              ▼                          ▼
    ┌──────────────────┐      ┌─────────────────────┐
    │   Frontend       │      │   Backend            │
    │   React + Vite   │      │   Django + DRF       │
    │   Vercel CDN     │◄────►│   Railway            │
    └──────────────────┘      │   Supabase (PG)      │
                              └─────────────────────┘
```

---

## Estructura del Proyecto

```
PorAmoraPuebla-ChulaVia/
├── frontend/
│   ├── public/
│   │   ├── equipo/          # Fotos del equipo
│   │   └── zonas/           # Fotos de comunidades rurales (Mixteca)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── WhatsAppDemo.jsx   # Simulador interactivo del bot
│       ├── context/
│       │   └── LangContext.jsx    # i18n hook: useT(section, key)
│       ├── data/
│       │   ├── api.js             # Llamadas al backend Django
│       │   ├── comunidades.js     # 15 seed communities con rutas
│       │   ├── comunidades_mapa.json  # 691 comunidades INEGI
│       │   └── traducciones.json  # ES / NAH / TOT — ~200 claves
│       └── pages/
│           ├── Landing.jsx        # Hero + Stats + Cómo funciona + WA Demo
│           ├── MapPage.jsx        # Mapa Leaflet con 691 comunidades
│           ├── SearchPage.jsx     # Buscador de rutas + modal de reservación
│           ├── JoinPage.jsx       # Registro de transportistas (3 pasos)
│           └── GovDashboard.jsx   # Dashboard con Recharts
├── backend/                       # Django + Railway (Isabel Ruiz)
└── docs/                          # Investigación, datos y traducciones
```

---

## Correr Localmente

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Variables de entorno (frontend)
VITE_API_URL=https://tu-backend.railway.app
```

```bash
# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py shell < seed.py   # Cargar 15 comunidades seed
python manage.py runserver
```

---

## Alineación con el PED Puebla 2024–2030

| Objetivo / Línea de Acción | Cómo ChulaVía la cumple |
|---------------------------|------------------------|
| **4.3.1** — Impulsar la movilidad sostenible y accesible | Digitaliza el 90% del transporte rural que hoy es invisible |
| **4.3.1.1** — Reordenamiento del transporte público | Registra y ordena rutas informales sin eliminar medios de vida |
| **4.3.1.4** — Instrumentos origen-destino / Plan Maestro | El buscador ES ese instrumento. El dashboard alimenta el Plan Maestro |
| **Proyectos 16 y 17** — Circuitos Mixteca y Sierra Nororiental | ChulaVía es la capa digital que activa esos circuitos para la ciudadanía |
| **Eje Transversal** — Pueblos indígenas y grupos vulnerables | Bot en Náhuatl y Totonaco, funciona con 2G |

**Indicador clave:** El índice de movilidad estatal 2023 fue 88.32 (meta 2030: 91.32). ChulaVía genera por primera vez los datos para medirlo correctamente en zonas rurales.

---

## Seguridad de Transportistas

**Capa 1 — Registro verificado**
- Nombre completo + últimos 4 dígitos de INE
- Placa del vehículo + foto
- Número verificado por SMS (Twilio OTP)

**Capa 2 — Reputación comunitaria**
- Sistema de calificaciones 1–5 estrellas por pasajeros reales
- Badge "Verificado por la comunidad" al superar 10 viajes y 4.0 estrellas
- Reportes de usuarios para revisión

**Capa 3 — Datos para el gobierno**
- Dashboard muestra actividad, calificaciones y reportes en tiempo real
- El gobierno puede suspender transportistas con reportes graves
- Infinitamente más seguro que el sistema informal actual

---

## Roadmap

| Fase | Plazo | Contenido |
|------|-------|-----------|
| **01 — Hoy** | Hackathon | App web + Bot WhatsApp + Dashboard gobierno + 15 comunidades seed |
| **02 — 30 días** | Mes 1 | 80+ comunidades, 5 regiones, reportes de infraestructura vial |
| **03 — 60-90 días** | Meses 2-3 | 217 municipios, alianza SMOT/CONAPO, voz sin leer ni escribir |

---

## El Equipo

| Integrante | Rol | Stack |
|-----------|-----|-------|
| **Miguel Barranco** | Frontend & UX | React · Leaflet · Vite |
| **Isabel Ruiz** | Backend & API | Django · Railway · Supabase |
| **Monica Tapia** | Investigación & Datos | INEGI · CONAPO · Canva |
| **Sumayra Rivera** | Pitch & Estrategia | PED 2024-2030 · Impacto Social |

> Metodología Scrum · Sprint de 24 horas · Backlog priorizado

---

## Frase que Gana

> *"El PED 2024-2030 pide en su línea 4.3.1.4 instrumentos que tracen rutas origen-destino para el Plan Maestro de Transporte. La ASF reportó que el gobierno no sabe cuántas comunidades están desconectadas porque no hay datos. ChulaVía genera esos datos por primera vez, hoy, en Puebla."*

---

> **Porque moverse en Puebla es un derecho, no un privilegio.**

*Hackathon Por Amor a Puebla 2026 · Equipo ChulaVía*
