from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Comunidad, Ruta, Solicitud, Transportista
from .serializers import ComunidadSerializer, RutaSerializer, SolicitudSerializer
from twilio.twiml.messaging_response import MessagingResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json

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
                Q(origen_id=destino_id, destino_id=origen_id)  # rutas en ambas direcciones
            )
        return queryset

class SolicitudCreate(generics.CreateAPIView):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

class TransportistaCreate(generics.CreateAPIView):
    queryset = Transportista.objects.all()
    
    def create(self, request, *args, **kwargs):
        # Aqui iria el OTP de verificacion SMS
        return super().create(request, *args, **kwargs)

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
    # Comunidades con solicitudes pero sin rutas -> deficit
    comunidades_con_solicitudes = Solicitud.objects.values('origen_texto').annotate(
        total=Count('id')
    ).order_by('-total')[:10]
    
    return Response({
        'comunidades_mayor_demanda_sin_cobertura': list(comunidades_con_solicitudes)
    })

@api_view(['GET'])
def analytics_rutas_populares(request):
    rutas = Ruta.objects.annotate(
        num_solicitudes=Count('solicitudes')
    ).order_by('-num_solicitudes')[:5]
    return Response(RutaSerializer(rutas, many=True).data)

# diccionario en memoria para el estado del bot (suficiente para demo)
CONVERSACIONES = {}

@csrf_exempt
def whatsapp_webhook(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    numero = request.POST.get('From', '')
    mensaje = request.POST.get('Body', '').strip().lower()
    
    respuesta = MessagingResponse()
    msg = respuesta.message()
    
    estado = CONVERSACIONES.get(numero, {'paso': 'inicio'})
    
    if mensaje in ['hola', 'hola!', 'hi', 'inicio', 'menu']:
        CONVERSACIONES[numero] = {'paso': 'pedir_origen'}
        msg.body("Bienvenido a ChulaVia!\nConecta tu comunidad.\n\nDe donde sales? Escribe el nombre de tu comunidad.")
    
    elif estado['paso'] == 'pedir_origen':
        CONVERSACIONES[numero] = {'paso': 'pedir_destino', 'origen': mensaje}
        msg.body(f"Salida desde: {mensaje}\n\nA donde vas? Escribe el nombre de la comunidad destino.")
    
    elif estado['paso'] == 'pedir_destino':
        origen = estado['origen']
        destino = mensaje
        
        # Buscar rutas disponibles
        rutas = Ruta.objects.filter(
            Q(origen__nombre__icontains=origen, destino__nombre__icontains=destino) |
            Q(origen__nombre__icontains=destino, destino__nombre__icontains=origen),
            activa=True
        )[:3]
        
        if rutas:
            opciones = ""
            ruta_ids = {}
            for i, ruta in enumerate(rutas, 1):
                horarios = ', '.join(ruta.horarios[:2])
                opciones += f"{i}. {ruta.transportista.nombre} - {ruta.transportista.tipo_vehiculo}\n   Precio: ${ruta.precio} | Sale: {horarios}\n\n"
                ruta_ids[str(i)] = ruta.id
            
            CONVERSACIONES[numero] = {
                'paso': 'confirmar',
                'origen': origen,
                'destino': destino,
                'ruta_ids': ruta_ids
            }
            msg.body(f"Encontramos estas opciones de {origen} a {destino}:\n\n{opciones}Responde el numero de tu opcion (1, 2, o 3).")
        
        else:
            CONVERSACIONES[numero] = {'paso': 'inicio'}
            Solicitud.objects.create(
                origen_texto=origen,
                destino_texto=destino,
                telefono_whatsapp=numero,
                fecha_viaje='2026-04-27'
            )
            msg.body(f"Aun no tenemos ruta de {origen} a {destino}.\nRegistramos tu solicitud para que mas transportistas la vean.\n\nEscribe 'hola' para buscar otra ruta.")
    
    elif estado['paso'] == 'confirmar' and mensaje in ['1', '2', '3']:
        ruta_ids = estado.get('ruta_ids', {})
        ruta_id = ruta_ids.get(mensaje)
        
        if ruta_id:
            try:
                ruta = Ruta.objects.get(id=ruta_id)
                Solicitud.objects.create(
                    origen_texto=estado['origen'],
                    destino_texto=estado['destino'],
                    ruta=ruta,
                    telefono_whatsapp=numero,
                    fecha_viaje='2026-04-27',
                    estado='confirmada'
                )
                msg.body(f"Reservacion confirmada!\n\n{ruta.transportista.nombre} te espera.\nContacto: {ruta.transportista.telefono}\nPrecio: ${ruta.precio}\n\nEscribe 'hola' para hacer otra busqueda.")
            except Ruta.DoesNotExist:
                msg.body("Ocurrio un error. Escribe 'hola' para empezar.")
        
        CONVERSACIONES[numero] = {'paso': 'inicio'}
    
    else:
        msg.body("Escribe 'hola' para buscar transporte entre comunidades.")
    
    return HttpResponse(str(respuesta), content_type='text/xml')
