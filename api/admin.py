from django.contrib import admin
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

admin.site.register(Calificacion)
