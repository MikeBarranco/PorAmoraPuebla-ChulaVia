from rest_framework import serializers
from .models import Comunidad, Transportista, Ruta, Solicitud

class ComunidadSerializer(serializers.ModelSerializer):
    nombre_mostrado = serializers.SerializerMethodField()

    class Meta:
        model = Comunidad
        fields = ['id', 'nombre', 'nombre_mostrado', 'nombre_nahuatl', 'nombre_totonaco', 'municipio', 'lat', 'lng', 'poblacion', 'tiene_transporte_formal']

    def get_nombre_mostrado(self, obj):
        lang = self.context.get('lang', 'es')
        if lang == 'nah' and obj.nombre_nahuatl:
            return obj.nombre_nahuatl
        if lang == 'tot' and obj.nombre_totonaco:
            return obj.nombre_totonaco
        return obj.nombre

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
        fields = '__all__' 