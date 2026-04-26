<div align="center">

<img src="frontend/public/logo.png" alt="ChulaVía Logo" width="120"/>

# ChulaVía
### La primera plataforma digital de movilidad rural de Puebla

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://chula-via.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Backend-Railway-7B2FBE?style=for-the-badge&logo=railway)](https://poramorapuebla-chulavia-production.up.railway.app/api/)
[![WhatsApp Bot](https://img.shields.io/badge/Bot-WhatsApp-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/14155238886?text=hola)
[![Hackathon](https://img.shields.io/badge/Hackathon-Por%20Amor%20a%20Puebla%202026-E63946?style=for-the-badge)](https://poramorapuebla.mx)

**Hackathon Por Amor a Puebla 2026 · Eje: Movilidad · Reto: Transporte Rural Intercomunitario**

> *"El PED 2024-2030 pide instrumentos que tracen rutas origen-destino para el Plan Maestro de Transporte. La ASF reportó que el gobierno no sabe cuántas comunidades están desconectadas. ChulaVía genera esos datos por primera vez, hoy, en Puebla."*

</div>

---

## 📌 El Problema

La **Auditoría Superior de la Federación** documentó que las secretarías de Estado **no pueden cuantificar** cuántas localidades rurales están desconectadas del transporte — porque **no existe ningún censo**.

| Dato | Cifra |
|------|-------|
| Localidades rurales en Puebla sin transporte formal | **6,082** |
| Municipios de alta marginación sin transporte registrado | **86** |
| Transporte informal en zonas rurales de alta marginación | **90%** |
| Costo de un viaje informal vs. formal | **+40% más caro** |

El sistema urbano de Puebla (RUTA, SIMPUEBLA, Yankuilotl) existe y funciona. **Lo rural es el único vacío real** que el propio PED 2024–2030 reconoce y aún no tiene respuesta digital.

---

## 💡 La Solución

ChulaVía digitaliza el transporte informal intercomunitario en **tres capas simultáneas**:

```
👤 CIUDADANO RURAL           🚐 TRANSPORTISTA              🏛️ GOBIERNO
─────────────────────        ──────────────────────        ──────────────────────
Busca rutas desde            Registra su ruta y            Dashboard en tiempo real
WhatsApp con 2G              recibe reservaciones          con déficit de movilidad
Sin app que instalar         Aumenta su ocupación          Datos para el PED 2024-2030
En Español, Náhuatl          Badge de verificado           Mapa de 691 comunidades
o Totonaco                   Calificaciones reales         Inversión basada en datos
```

---

## ✨ Funcionalidades

### 🗺️ Para el Ciudadano
- **Búsqueda de rutas inteligente** — Origen y destino entre 691 comunidades de la región Mixteca
- **Transportistas verificados** — INE confirmado, placa registrada, calificaciones de pasajeros reales
- **Reservación por WhatsApp** — Sin app que instalar. Funciona con 2G en cualquier teléfono básico
- **Bot multilingüe** — Flujo completo en Español, Náhuatl y Totonaco
- **Folio de confirmación** — Código único `CVA-2026-XXXX` enviado al instante por WhatsApp
- **Recordatorios automáticos** — El bot avisa la hora y el folio el día del viaje

### 🚐 Para el Transportista
- **Registro en 3 pasos** — Datos personales, ruta habitual y horarios
- **Foto del vehículo** — Subida y comprimida automáticamente (de ~600KB a ~35KB)
- **Badge verificado** — Genera confianza y más reservaciones
- **Calificaciones en tiempo real** — El bot pide estrellas al pasajero al terminar el viaje
- **Panel del conductor** — Vista de viajes activos y ganancias acumuladas

### 🏛️ Para el Gobierno
- **Dashboard en tiempo real** — KPIs de comunidades, rutas, transportistas y solicitudes
- **Mapa de cobertura** — 691 comunidades visualizadas con estado de cobertura actual
- **Análisis de déficit** — Solicitudes sin ruta disponible = oportunidades de inversión pública
- **Exportable para el PED** — Datos alineados con líneas de acción 4.3.1.1 y 4.3.1.4

---

## 🤖 Bot de WhatsApp — Flujo Completo

```
Usuario → "Hola"
  ↓
ChulaVía Bot → "¡Bienvenido! Selecciona tu idioma: 1.Español 2.Náhuatl 3.Totonaco"
  ↓
Usuario → "1"
  ↓
Bot → "¿De dónde sales? Escribe el nombre de tu comunidad."
  ↓
Usuario → "Tehuitzingo"
  ↓
Bot → "¿A dónde vas?"
  ↓
Usuario → "Acatlán de Osorio"
  ↓
Bot → "🗺️ 2 rutas disponibles:
       1️⃣ Ernesto García · $35 · Sale: 07:00 ⭐ 4.8
       2️⃣ Combi Mixteca  · $30 · Sale: 09:00 ⭐ 4.5"
  ↓
Usuario → "1"
  ↓
Bot → "✅ ¡Reservación confirmada!
       Ernesto García te espera a las 07:00
       Contacto: 222-134-5678 · Precio: $35
       📋 Folio: CVA-2026-4829"
  ↓
[Día del viaje]
Bot → "⏰ Recordatorio: Mañana es tu viaje a Acatlán.
       Folio: CVA-2026-4829 · Hora: 07:00 ¡Buen viaje!"
  ↓
[Al terminar]
Bot → "¿Cómo estuvo el servicio? Responde del 1 al 5 ⭐"
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18 | SPA con componentes reutilizables |
| Vite | 5 | Build tool con HMR |
| Leaflet.js | 1.9 | Mapa interactivo con 691 comunidades |
| Recharts | 2.x | Gráficas del dashboard de gobierno |
| React Router | v6 | Navegación entre 5 páginas |
| Lucide React | Latest | Sistema de iconos vectoriales |
| Context API | — | i18n: Español, Náhuatl, Totonaco |
| Vercel | — | Deploy automático desde `main` branch |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Django | 4.2 | Framework principal |
| Django REST Framework | 3.x | API REST con 9 endpoints |
| PostgreSQL (Supabase) | 15 | Base de datos geoespacial |
| Twilio | Latest | Bot de WhatsApp automatizado |
| Pillow | 10.x | Compresión de fotos de vehículos |
| Railway | — | Deploy del backend con Gunicorn |

### Datos
| Fuente | Contenido |
|--------|-----------|
| INEGI Censo 2020 | Base de las 6,082 localidades rurales de Puebla |
| CONAPO Marginación 2020 | Clasificación de municipios de alta marginación |
| Instituto Mexicano del Transporte | Estadística del 90% de transporte informal |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO RURAL                               │
│  WhatsApp (2G) ──► Twilio ──► Webhook Django ──► Bot Response   │
│  Navegador Web ──► React SPA ──────────────────► API Django     │
└─────────────────────────────────────────────────────────────────┘
                                    │
               ┌────────────────────┼───────────────────────┐
               ▼                    ▼                        ▼
   ┌─────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
   │   Vercel CDN    │  │   Railway (Backend)  │  │ Supabase (DB)    │
   │   React + Vite  │◄►│   Django + DRF       │◄►│ PostgreSQL 15    │
   │   5 páginas     │  │   9 endpoints REST   │  │ 691 comunidades  │
   │   3 idiomas     │  │   Bot WhatsApp       │  │ Rutas y viajes   │
   └─────────────────┘  └─────────────────────┘  └──────────────────┘
```

---

## 📁 Estructura del Proyecto

```
PorAmoraPuebla-ChulaVia/
│
├── 📂 frontend/
│   ├── 📂 public/
│   │   ├── logo.png                  # Logo oficial de ChulaVía
│   │   ├── 📂 equipo/                # Fotos del equipo (optimizadas ~35KB)
│   │   └── 📂 zonas/                 # Fotos de comunidades rurales
│   └── 📂 src/
│       ├── 📂 components/
│       │   ├── Navbar.jsx             # Navegación + Talavera pattern + i18n
│       │   ├── TripSimulator.jsx      # Simulador interactivo del bot WA
│       │   └── WhatsAppDemo.jsx       # Demo visual en la landing page
│       ├── 📂 context/
│       │   └── LangContext.jsx        # Hook useT() para i18n
│       ├── 📂 data/
│       │   ├── api.js                 # Llamadas al backend Django
│       │   ├── comunidades.js         # 15 comunidades seed con rutas
│       │   ├── comunidades_mapa.json  # 691 comunidades INEGI
│       │   └── traducciones.json      # ~200 claves en ES / NAH / TOT
│       └── 📂 pages/
│           ├── Landing.jsx            # Hero + Stats + Demo WA + CTA
│           ├── MapPage.jsx            # Mapa Leaflet con 691 puntos
│           ├── SearchPage.jsx         # Buscador de rutas + reservación
│           ├── JoinPage.jsx           # Registro de transportistas
│           └── GovDashboard.jsx       # Dashboard con Recharts
│
├── 📂 backend/
│   ├── settings.py                    # Configuración Django + Twilio
│   └── urls.py                        # 9 endpoints REST
│
├── 📂 api/
│   ├── models.py                      # Comunidad, Ruta, Solicitud, WA Bot
│   ├── views.py                       # Lógica API + Bot WhatsApp
│   ├── serializers.py                 # Serialización DRF
│   ├── whatsapp_utils.py              # Envío de mensajes Twilio
│   └── 📂 migrations/                 # 5 migraciones de DB
│
├── 📂 img/                            # Fotos originales del equipo
├── 📂 docs/                           # Investigación y datos fuente
├── seed.py                            # Script para cargar comunidades seed
├── import_json_data.py                # Importar 691 comunidades INEGI
├── restore.py                         # Script de restauración de DB
├── requirements.txt                   # Dependencias Python
└── Procfile                           # Configuración Gunicorn para Railway
```

---

## 🚀 Correr Localmente

### Requisitos previos
- Python 3.11+
- Node.js 18+
- Git

### Backend (Django)
```bash
# Clonar el repositorio
git clone https://github.com/MikeBarranco/PorAmoraPuebla-ChulaVia.git
cd PorAmoraPuebla-ChulaVia

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno (crear archivo .env en la raíz)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Migraciones y datos
python manage.py migrate
python manage.py shell < seed.py     # 15 comunidades seed
# python manage.py shell < import_json_data.py  # 691 comunidades INEGI

# Correr servidor
python manage.py runserver           # http://localhost:8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install

# Variables de entorno (crear frontend/.env)
VITE_API_URL=http://localhost:8000

npm run dev                          # http://localhost:5173
```

### API Endpoints disponibles
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| `GET` | `/api/comunidades/` | Lista de 691 comunidades |
| `GET/POST` | `/api/rutas/` | Rutas de transporte |
| `POST` | `/api/solicitudes/` | Crear reservación |
| `POST` | `/api/transportistas/` | Registrar transportista |
| `POST` | `/api/whatsapp/webhook/` | Webhook del bot de WhatsApp |
| `GET` | `/api/analytics/resumen/` | KPIs para el dashboard |
| `GET` | `/api/analytics/deficit/` | Análisis de déficit de movilidad |
| `GET` | `/api/analytics/rutas-populares/` | Top 5 rutas más solicitadas |
| `POST` | `/api/subir-foto-transportista/` | Comprimir y guardar foto |

---

## 🌍 Internacionalización (i18n)

ChulaVía está disponible en **3 idiomas** para garantizar accesibilidad a comunidades indígenas:

| Idioma | Código | Estado |
|--------|--------|--------|
| Español | `es` | ✅ Completo |
| Náhuatl | `nah` | ✅ ~200 claves traducidas |
| Totonaco | `tot` | ✅ ~200 claves traducidas |

> Traducciones en proceso de validación con el **Instituto Poblano de los Pueblos Indígenas**.

---

## 📊 Alineación con el PED Puebla 2024–2030

| Objetivo / Línea de Acción | Cómo ChulaVía la cumple |
|---------------------------|------------------------|
| **4.3.1** — Impulsar la movilidad sostenible y accesible | Digitaliza el 90% del transporte rural invisible |
| **4.3.1.1** — Reordenamiento del transporte público | Registra y ordena rutas informales sin eliminar medios de vida |
| **4.3.1.4** — Instrumentos origen-destino / Plan Maestro | El buscador ES ese instrumento. El dashboard alimenta el Plan Maestro |
| **Proyectos 16 y 17** — Circuitos Mixteca y Sierra Nororiental | ChulaVía es la capa digital que activa esos circuitos |
| **Eje Transversal** — Pueblos indígenas y grupos vulnerables | Bot en Náhuatl y Totonaco, funciona con 2G |

**Indicador clave:** El índice de movilidad estatal 2023 fue **88.32** (meta 2030: 91.32). ChulaVía genera por primera vez los datos para medirlo correctamente en zonas rurales.

---

## 🔐 Seguridad de Transportistas

```
CAPA 1 — REGISTRO VERIFICADO
  ✓ Nombre completo + últimos 4 dígitos de INE
  ✓ Placa del vehículo + foto del vehículo
  ✓ Número verificado por WhatsApp (Twilio)

CAPA 2 — REPUTACIÓN COMUNITARIA
  ✓ Sistema de calificaciones 1–5 ⭐ por pasajeros reales
  ✓ Badge "Verificado por la comunidad" al superar 10 viajes y 4.0 ⭐
  ✓ Reportes de usuarios para revisión gubernamental

CAPA 3 — DATOS PARA EL GOBIERNO
  ✓ Dashboard muestra actividad, calificaciones y reportes en tiempo real
  ✓ El gobierno puede suspender transportistas con reportes graves
  ✓ Infinitamente más transparente que el sistema informal actual
```

---

## 📈 Roadmap

| Fase | Plazo | Contenido |
|------|-------|-----------|
| **01 — Hackathon** | Hoy | App web + Bot WhatsApp + Dashboard gobierno + 691 comunidades |
| **02 — Mes 1** | 30 días | 5 regiones activas, reportes de infraestructura vial, pagos en línea |
| **03 — Mes 2-3** | 60-90 días | 217 municipios, alianza SMOT/CONAPO, asistencia por voz (sin leer) |
| **04 — Escalado** | 6 meses | Modelo replicable para otros estados rurales de México |

---

## 👥 El Equipo

<table>
  <tr>
    <td align="center">
      <b>Miguel Barranco</b><br/>
      Frontend & UX<br/>
      <code>React · Leaflet · Vite</code>
    </td>
    <td align="center">
      <b>Isabel Ruiz</b><br/>
      Backend & API<br/>
      <code>Django · Railway · Supabase</code>
    </td>
    <td align="center">
      <b>Mónica Tapia</b><br/>
      Investigación & Datos<br/>
      <code>INEGI · CONAPO · Canva</code>
    </td>
    <td align="center">
      <b>Sumayra Rivera</b><br/>
      Pitch & Estrategia<br/>
      <code>PED 2024-2030 · Impacto Social</code>
    </td>
  </tr>
</table>

> Metodología Scrum · Sprint de 24 horas · Backlog priorizado por impacto social

---

## 📊 Métricas del Proyecto

```
📝 Líneas de código:        +12,000
🗺️ Comunidades en el mapa:     691
🌐 Idiomas disponibles:           3
⚡ Endpoints REST:                9
🗄️ Modelos de base de datos:      6
📱 Plataformas soportadas:  Web + WhatsApp
🚀 Tiempo de carga inicial:   < 2s
```

---

## 🤝 Contribuir

Este proyecto fue creado durante un hackathon de 24 horas pero está diseñado para crecer. Si quieres contribuir:

1. Haz un fork del repositorio
2. Crea una branch: `git checkout -b feature/nueva-funcionalidad`
3. Haz tus cambios y commit: `git commit -m 'feat: descripción del cambio'`
4. Push a tu branch: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

<div align="center">

## 🚐 ChulaVía

**Porque moverse en Puebla es un derecho, no un privilegio.**

*Hackathon Por Amor a Puebla 2026 · Equipo ChulaVía*

[![Frontend](https://img.shields.io/badge/Ver%20App-chula--via.vercel.app-black?style=for-the-badge&logo=vercel)](https://chula-via.vercel.app)
[![WhatsApp Bot](https://img.shields.io/badge/Probar%20Bot-WhatsApp-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/14155238886?text=hola)

</div>
