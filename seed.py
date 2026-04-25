from api.models import Comunidad, Transportista, Ruta, Solicitud

# Limpiar datos previos
Comunidad.objects.all().delete()
Transportista.objects.all().delete()

# Comunidades de Puebla
comunidades_data = [
    {"nombre": "Tehuitzingo", "municipio": "Tehuitzingo", "lat": 18.3617, "lng": -98.2828, "poblacion": 4500},
    {"nombre": "Acatlan de Osorio", "municipio": "Acatlan", "lat": 18.2050, "lng": -98.0506, "poblacion": 12000, "tiene_transporte_formal": True},
    {"nombre": "Chiautla de Tapia", "municipio": "Chiautla", "lat": 18.2994, "lng": -98.5683, "poblacion": 6800, "tiene_transporte_formal": True},
    {"nombre": "Izucar de Matamoros", "municipio": "Izucar", "lat": 18.5989, "lng": -98.4661, "poblacion": 45000, "tiene_transporte_formal": True},
    {"nombre": "Coatzingo", "municipio": "Coatzingo", "lat": 18.2717, "lng": -98.2128, "poblacion": 3200},
    {"nombre": "Piaxtla", "municipio": "Piaxtla", "lat": 18.1683, "lng": -98.2289, "poblacion": 2100},
    {"nombre": "Xayacatlan de Bravo", "municipio": "Xayacatlan", "lat": 18.2261, "lng": -98.2472, "poblacion": 2800},
    {"nombre": "San Pablo Anicano", "municipio": "Tehuitzingo", "lat": 18.3453, "lng": -98.3012, "poblacion": 680},
    {"nombre": "San Jeronimo Xayacatlan", "municipio": "Xayacatlan", "lat": 18.2100, "lng": -98.2600, "poblacion": 520},
    {"nombre": "Santa Ana Coatlichan", "municipio": "Tehuitzingo", "lat": 18.3200, "lng": -98.3400, "poblacion": 340},
    {"nombre": "Chietla", "municipio": "Chietla", "lat": 18.4439, "lng": -98.6619, "poblacion": 5600, "tiene_transporte_formal": True},
    {"nombre": "Tilapa", "municipio": "Tilapa", "lat": 18.3389, "lng": -98.3667, "poblacion": 890},
    {"nombre": "San Pablo Ahuatempan", "municipio": "Ahuatempan", "lat": 18.2778, "lng": -97.9719, "poblacion": 1200},
    {"nombre": "Huehuetlan el Grande", "municipio": "Huehuetlan", "lat": 18.3856, "lng": -98.0928, "poblacion": 3400},
    {"nombre": "Tulcingo del Valle", "municipio": "Tulcingo", "lat": 18.0631, "lng": -98.2278, "poblacion": 4100, "tiene_transporte_formal": True},
]

comunidades = {}
for data in comunidades_data:
    c = Comunidad.objects.create(**data)
    comunidades[data['nombre']] = c
    print(f"Comunidad creada: {c.nombre}")

# Transportistas
transportistas_data = [
    {"nombre": "Ernesto Garcia Lopez", "telefono": "2221345678", "tipo_vehiculo": "combi", "capacidad": 12, "placa": "PBL-123", "ine_ultimos_4": "4521", "calificacion": 4.8, "total_viajes": 145, "verificado": True},
    {"nombre": "Maria Guadalupe Flores", "telefono": "2227654321", "tipo_vehiculo": "camioneta", "capacidad": 8, "placa": "PUE-456", "ine_ultimos_4": "7823", "calificacion": 4.6, "total_viajes": 89, "verificado": True},
    {"nombre": "Jose Antonio Reyes", "telefono": "2229871234", "tipo_vehiculo": "mototaxi", "capacidad": 2, "placa": "MT-789", "ine_ultimos_4": "3312", "calificacion": 4.9, "total_viajes": 234, "verificado": True},
    {"nombre": "Transportes Rivera e Hijos", "telefono": "2224567890", "tipo_vehiculo": "camioneta", "capacidad": 10, "placa": "PUE-012", "ine_ultimos_4": "6654", "calificacion": 4.5, "total_viajes": 67, "verificado": True},
    {"nombre": "Roberto Sanchez Mendez", "telefono": "2226543210", "tipo_vehiculo": "combi", "capacidad": 14, "placa": "PBL-345", "ine_ultimos_4": "9987", "calificacion": 4.3, "total_viajes": 42, "verificado": False},
]

transportistas = {}
for data in transportistas_data:
    t = Transportista.objects.create(**data)
    transportistas[data['nombre']] = t
    print(f"Transportista creado: {t.nombre}")

# Rutas
rutas_data = [
    {
        "transportista": transportistas["Ernesto Garcia Lopez"],
        "origen": comunidades["Tehuitzingo"],
        "destino": comunidades["Acatlan de Osorio"],
        "precio": 35,
        "horarios": ["07:00", "12:00", "17:00"],
        "dias": ["lunes", "miercoles", "viernes", "sabado"]
    },
    {
        "transportista": transportistas["Maria Guadalupe Flores"],
        "origen": comunidades["Chiautla de Tapia"],
        "destino": comunidades["Izucar de Matamoros"],
        "precio": 45,
        "horarios": ["06:30", "13:00"],
        "dias": ["lunes", "martes", "miercoles", "jueves", "viernes"]
    },
    {
        "transportista": transportistas["Jose Antonio Reyes"],
        "origen": comunidades["Coatzingo"],
        "destino": comunidades["Acatlan de Osorio"],
        "precio": 20,
        "horarios": ["08:00", "10:00", "14:00", "16:00"],
        "dias": ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
    },
    {
        "transportista": transportistas["Transportes Rivera e Hijos"],
        "origen": comunidades["Piaxtla"],
        "destino": comunidades["Tehuitzingo"],
        "precio": 25,
        "horarios": ["07:30", "14:00"],
        "dias": ["martes", "jueves", "sabado"]
    },
    {
        "transportista": transportistas["Ernesto Garcia Lopez"],
        "origen": comunidades["Xayacatlan de Bravo"],
        "destino": comunidades["Acatlan de Osorio"],
        "precio": 30,
        "horarios": ["08:00", "15:00"],
        "dias": ["lunes", "miercoles", "viernes"]
    },
]

for data in rutas_data:
    r = Ruta.objects.create(**data)
    print(f"Ruta creada: {r}")

# Solicitudes de comunidades sin ruta (para mostrar deficit en dashboard)
solicitudes_deficit = [
    {"origen_texto": "San Pablo Anicano", "destino_texto": "Acatlan de Osorio", "telefono_whatsapp": "whatsapp:+522221111111", "fecha_viaje": "2026-04-27"},
    {"origen_texto": "San Jeronimo Xayacatlan", "destino_texto": "Tehuitzingo", "telefono_whatsapp": "whatsapp:+522222222222", "fecha_viaje": "2026-04-27"},
    {"origen_texto": "Santa Ana Coatlichan", "destino_texto": "Acatlan de Osorio", "telefono_whatsapp": "whatsapp:+522223333333", "fecha_viaje": "2026-04-28"},
    {"origen_texto": "Tilapa", "destino_texto": "Chiautla de Tapia", "telefono_whatsapp": "whatsapp:+522224444444", "fecha_viaje": "2026-04-28"},
    {"origen_texto": "San Pablo Ahuatempan", "destino_texto": "Acatlan de Osorio", "telefono_whatsapp": "whatsapp:+522225555555", "fecha_viaje": "2026-04-29"},
]

for data in solicitudes_deficit:
    Solicitud.objects.create(**data)

print("Seed completado exitosamente.")
