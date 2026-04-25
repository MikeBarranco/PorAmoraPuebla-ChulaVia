import os

files = {
    'Procfile': 'web: gunicorn backend.wsgi -b 0.0.0.0:$PORT --log-file -',
    '.gitignore': '''venv/
env/
.env
db.sqlite3
__pycache__/
*.pyc
.DS_Store''',
    'requirements.txt': '''Django==5.0.4
djangorestframework==3.15.1
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
twilio==9.0.4
python-dotenv==1.0.1
pillow==10.3.0
gunicorn==22.0.0
dj-database-url==2.1.0''',
    'manage.py': '''#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()''',
    'backend/urls.py': '''from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/comunidades/', views.ComunidadList.as_view()),
    path('api/rutas/', views.RutaList.as_view()),
    path('api/solicitudes/', views.SolicitudCreate.as_view()),
    path('api/transportistas/', views.TransportistaCreate.as_view()),
    path('api/whatsapp/webhook/', views.whatsapp_webhook),
    path('api/analytics/resumen/', views.analytics_resumen),
    path('api/analytics/deficit/', views.analytics_deficit),
    path('api/analytics/rutas-populares/', views.analytics_rutas_populares),
]''',
    'api/models.py': '''from django.db import models

class Comunidad(models.Model):
    nombre = models.CharField(max_length=200)
    municipio = models.CharField(max_length=200)
    lat = models.DecimalField(max_digits=10, decimal_places=8)
    lng = models.DecimalField(max_digits=11, decimal_places=8)
    poblacion = models.IntegerField(default=0)
    tiene_transporte_formal = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.nombre}, {self.municipio}"
    
    class Meta:
        ordering = ['municipio', 'nombre']

class Transportista(models.Model):
    TIPO_CHOICES = [
        ('combi', 'Combi'),
        ('camioneta', 'Camioneta Pick-up'),
        ('mototaxi', 'Mototaxi'),
        ('autobus', 'Autobus pequeno'),
    ]
    
    nombre = models.CharField(max_length=200)
    telefono = models.CharField(max_length=15, unique=True)
    tipo_vehiculo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    capacidad = models.IntegerField(default=8)
    placa = models.CharField(max_length=10)
    ine_ultimos_4 = models.CharField(max_length=4)
    foto_vehiculo_url = models.URLField(blank=True)
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_viajes = models.IntegerField(default=0)
    verificado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.nombre} ({self.tipo_vehiculo})"

class Ruta(models.Model):
    DIAS_CHOICES = [
        ('lunes', 'Lunes'),
        ('martes', 'Martes'),
        ('miercoles', 'Miercoles'),
        ('jueves', 'Jueves'),
        ('viernes', 'Viernes'),
        ('sabado', 'Sabado'),
        ('domingo', 'Domingo'),
    ]
    
    transportista = models.ForeignKey(Transportista, on_delete=models.CASCADE, related_name='rutas')
    origen = models.ForeignKey(Comunidad, on_delete=models.CASCADE, related_name='rutas_origen')
    destino = models.ForeignKey(Comunidad, on_delete=models.CASCADE, related_name='rutas_destino')
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    horarios = models.JSONField(default=list)
    dias = models.JSONField(default=list)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.origen.nombre} -> {self.destino.nombre}"

class Solicitud(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    origen_texto = models.CharField(max_length=200)
    destino_texto = models.CharField(max_length=200)
    ruta = models.ForeignKey(Ruta, on_delete=models.SET_NULL, null=True, blank=True, related_name='solicitudes')
    pasajeros = models.IntegerField(default=1)
    telefono_whatsapp = models.CharField(max_length=20)
    fecha_viaje = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.origen_texto} -> {self.destino_texto} ({self.estado})"

class Calificacion(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='calificaciones')
    solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    puntuacion = models.IntegerField()
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)''',
    'api/admin.py': '''from django.contrib import admin
from .models import Comunidad, Transportista, Ruta, Solicitud, Calificacion

@admin.register(Comunidad)
class ComunidadAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'municipio', 'poblacion', 'tiene_transporte_formal']
    list_filter = ['tiene_transporte_formal', 'municipio']
    search_fields = ['nombre', 'municipio']

@admin.register(Transportista)
class TransportistaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo_vehiculo', 'calificacion', 'total_viajes', 'verificado']
    list_filter = ['tipo_vehiculo', 'verificado', 'activo']

@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ['origen', 'destino', 'transportista', 'precio', 'activa']
    list_filter = ['activa']

@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):
    list_display = ['origen_texto', 'destino_texto', 'estado', 'fecha_viaje', 'fecha_creacion']
    list_filter = ['estado']

admin.site.register(Calificacion)''',
    'api/serializers.py': '''from rest_framework import serializers
from .models import Comunidad, Transportista, Ruta, Solicitud

class ComunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidad
        fields = '__all__'

class TransportistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transportista
        exclude = ['ine_ultimos_4']

class RutaSerializer(serializers.ModelSerializer):
    transportista = TransportistaSerializer(read_only=True)
    origen = ComunidadSerializer(read_only=True)
    destino = ComunidadSerializer(read_only=True)
    
    class Meta:
        model = Ruta
        fields = '__all__'

class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__' ''',
    'api/views.py': '''from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Comunidad, Ruta, Solicitud, Transportista
from .serializers import ComunidadSerializer, RutaSerializer, SolicitudSerializer
from twilio.twiml.messaging_response import MessagingResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

class ComunidadList(generics.ListAPIView):
    queryset = Comunidad.objects.all().order_by('municipio')
    serializer_class = ComunidadSerializer

class RutaList(generics.ListCreateAPIView):
    serializer_class = RutaSerializer
    
    def get_queryset(self):
        queryset = Ruta.objects.filter(activa=True)
        origen_id = self.request.query_params.get('origen')
        destino_id = self.request.query_params.get('destino')
        if origen_id and destino_id:
            queryset = queryset.filter(
                Q(origen_id=origen_id, destino_id=destino_id) |
                Q(origen_id=destino_id, destino_id=origen_id)
            )
        return queryset

class SolicitudCreate(generics.CreateAPIView):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

class TransportistaCreate(generics.CreateAPIView):
    queryset = Transportista.objects.all()

@api_view(['GET'])
def analytics_resumen(request):
    return Response({
        'total_comunidades': Comunidad.objects.count(),
        'comunidades_con_transporte': Comunidad.objects.filter(tiene_transporte_formal=True).count(),
        'total_transportistas': Transportista.objects.filter(activo=True).count(),
        'total_rutas': Ruta.objects.filter(activa=True).count(),
        'total_solicitudes': Solicitud.objects.count(),
        'viajes_completados': Solicitud.objects.filter(estado='completada').count(),
    })

@api_view(['GET'])
def analytics_deficit(request):
    comunidades_con_solicitudes = Solicitud.objects.values('origen_texto').annotate(
        total=Count('id')
    ).order_by('-total')[:10]
    return Response({'comunidades_mayor_demanda_sin_cobertura': list(comunidades_con_solicitudes)})

@api_view(['GET'])
def analytics_rutas_populares(request):
    rutas = Ruta.objects.annotate(
        num_solicitudes=Count('solicitudes')
    ).order_by('-num_solicitudes')[:5]
    return Response(RutaSerializer(rutas, many=True).data)

@csrf_exempt
def whatsapp_webhook(request):
    return HttpResponse("<Response><Message>Hola desde ChulaVia</Message></Response>", content_type='text/xml')''',
    'backend/wsgi.py': '''import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
application = get_wsgi_application()''',
    'backend/__init__.py': '',
    'api/__init__.py': '',
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
