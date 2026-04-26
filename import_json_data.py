import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Comunidad, Transportista, Ruta, Solicitud

def run():
    print("Iniciando importación masiva de datos...")
    
    # 1. Limpiar datos previos
    print("Limpiando base de datos...")
    Solicitud.objects.all().delete()
    Ruta.objects.all().delete()
    Transportista.objects.all().delete()
    Comunidad.objects.all().delete()

    # 2. Cargar comunidades desde JSON
    json_path = os.path.join('frontend', 'src', 'data', 'comunidades_mapa.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            comunidades_json = json.load(f)
            
        print(f"Cargando {len(comunidades_json)} comunidades desde JSON...")
        
        comunidades_creadas = []
        for item in comunidades_json:
            c = Comunidad(
                nombre=item['nombre'],
                municipio=item['municipio'],
                lat=item['lat'],
                lng=item['lng'],
                poblacion=item.get('poblacion', 0),
                tiene_transporte_formal=item.get('tieneTransporte', False)
            )
            # Agregar nombres en Nahuatl/Totonaco si los conocemos (para los de la demo)
            if item['nombre'] == "Tehuitzingo":
                c.nombre_nahuatl = "Tehuitzinko"
                c.nombre_totonaco = "Tehwitzin"
            elif item['nombre'] == "Acatlán de Osorio":
                c.nombre_nahuatl = "Akatlan"
            
            comunidades_creadas.append(c)
        
        Comunidad.objects.bulk_create(comunidades_creadas)
        print(f"Éxito: {len(comunidades_creadas)} comunidades importadas.")
        
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {json_path}")
        return

    # 3. Crear transportistas de prueba (para que el bot funcione)
    print("Creando transportistas de prueba...")
    t1 = Transportista.objects.create(
        nombre="Ernesto Garcia Lopez", 
        telefono="2221345678", 
        tipo_vehiculo="combi", 
        capacidad=12, 
        placa="PBL-123", 
        ine_ultimos_4="4521", 
        calificacion=4.8, 
        total_viajes=145, 
        verificado=True
    )
    t2 = Transportista.objects.create(
        nombre="Maria Guadalupe Flores", 
        telefono="2227654321", 
        tipo_vehiculo="camioneta", 
        capacidad=8, 
        placa="PUE-456", 
        ine_ultimos_4="7823", 
        calificacion=4.6, 
        total_viajes=89, 
        verificado=True
    )

    # 4. Crear un par de rutas para la demo
    # Buscamos comunidades reales que estén en el JSON
    c_origen = Comunidad.objects.filter(nombre__icontains="Huaxcaleca").first()
    c_destino = Comunidad.objects.filter(nombre__icontains="Santa Cecilia").first()

    if c_origen and c_destino:
        Ruta.objects.create(
            transportista=t1,
            origen=c_origen,
            destino=c_destino,
            precio=45,
            horarios=["08:00", "14:00", "18:00"],
            dias=["lunes", "martes", "miercoles", "jueves", "viernes"]
        )
        print(f"Ruta demo creada: {c_origen.nombre} -> {c_destino.nombre}")
    else:
        # Si no están esas, usamos las de Tehuitzingo que siempre están
        c1 = Comunidad.objects.filter(nombre__icontains="Tehuitzingo").first()
        c2 = Comunidad.objects.filter(nombre__icontains="Acatlán").first()
        if c1 and c2:
            Ruta.objects.create(
                transportista=t1,
                origen=c1,
                destino=c2,
                precio=35,
                horarios=["07:00", "12:00", "17:00"],
                dias=["lunes", "miercoles", "viernes"]
            )
            print(f"Ruta demo creada: {c1.nombre} -> {c2.nombre}")

    print("¡Importación masiva completada exitosamente!")

if __name__ == "__main__":
    run()
