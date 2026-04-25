from rest_framework import serializers
from .models import Comunidad, Transportista, Ruta, Solicitud

class ComunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidad
        fields = '__all__'

class TransportistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transportista
        exclude = ['ine_ultimos_4']  # no exponer datos sensibles

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
        fields = '__all__'
