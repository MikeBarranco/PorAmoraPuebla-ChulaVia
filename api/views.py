import base64
from io import BytesIO
from PIL import Image
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Comunidad, Ruta, Solicitud, Transportista
from .serializers import ComunidadSerializer, RutaSerializer, SolicitudSerializer, TransportistaSerializer
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
    serializer_class = TransportistaSerializer

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
    incoming_msg = request.POST.get('Body', '').lower()
    resp = MessagingResponse()
    msg = resp.message()

    if 'hola' in incoming_msg or 'menú' in incoming_msg or 'menu' in incoming_msg or 'inicio' in incoming_msg:
        msg.body("👋 ¡Hola! Soy el asistente virtual de *ChulaVía* 🚐.\n\nPor favor, responde con el número de la opción que necesitas:\n\n1️⃣ Buscar viaje\n2️⃣ Cancelar/Modificar un viaje\n3️⃣ Ver rutas populares\n4️⃣ Pedir ayuda a soporte")
    
    elif '1' in incoming_msg and len(incoming_msg) < 3:
        msg.body("Perfecto. Dime de dónde sales y a dónde vas.\n*(Ejemplo: De Tehuitzingo a Acatlán)*")
        
    elif 'tehuitzingo' in incoming_msg and 'acatl' in incoming_msg:
        msg.body("📅 ¿Qué día y a qué hora te gustaría viajar?\n*(Ejemplo: Hoy a las 5pm, Mañana en la mañana)*")
        
    elif 'hoy' in incoming_msg or 'mañana' in incoming_msg or 'pm' in incoming_msg or 'am' in incoming_msg:
        msg.body("🔍 *Buscando disponibilidad...*\n\n✅ ¡Encontré un lugar perfecto para ti!\n\n👤 Conductor: *Ernesto García*\n🚐 Unidad: Combi (PBL-123)\n⭐ Calificación: 4.8 / 5.0\n🕒 Salida: 17:00\n💵 Costo: $35 MXN\n\nResponde *CONFIRMAR* para apartar tu lugar o *CANCELAR* para buscar otra opción.")
        
    elif 'confirmar' in incoming_msg:
        msg.body("🎉 ¡Tu lugar está apartado exitosamente! Ernesto te espera en la base principal.\n\n🎫 *Folio de viaje:* CHV-9824\n\n¿Hay algo más en lo que te pueda ayudar hoy? Escribe *Menú* para regresar al inicio.")
        
    elif '2' in incoming_msg and len(incoming_msg) < 3:
        msg.body("⚠️ Para cancelar o modificar un viaje, por favor escribe tu *Folio de viaje* (Ejemplo: CHV-9824).")
        
    elif 'chv' in incoming_msg:
        msg.body("✅ Hemos encontrado tu viaje (Folio: CHV-9824).\n\nEscribe *CANCELAR VIAJE* si ya no vas a asistir, o *MODIFICAR* si quieres cambiar la hora.")
        
    elif 'cancelar viaje' in incoming_msg:
        msg.body("🗑️ Tu viaje ha sido cancelado exitosamente. No se te hará ningún cobro.\n\nEscribe *Menú* si necesitas buscar otro viaje. ¡Gracias por usar ChulaVía!")
        
    elif 'modificar' in incoming_msg:
        msg.body("✏️ Para modificar tu viaje, un asesor humano te contactará en los próximos 5 minutos. \n\nEscribe *Menú* para regresar a las opciones principales.")
        
    elif '3' in incoming_msg and len(incoming_msg) < 3:
        msg.body("📍 *Rutas Populares de hoy:*\n- Chiautla -> Izúcar ($45)\n- Coatzingo -> Acatlán ($20)\n\nEscribe *1* para buscar un viaje.")
        
    elif '4' in incoming_msg and len(incoming_msg) < 3:
        msg.body("📞 *Soporte ChulaVía*\nEn un momento te comunicaremos con un humano.\n\nSi quieres volver al inicio, escribe *Menú*.")
        
    else:
        msg.body("Lo siento, no entendí bien eso. 🤔\n\nPor favor, escribe la palabra *Hola* o *Menú* para ver las opciones principales.")

    return HttpResponse(str(resp), content_type='text/xml')

@api_view(['POST'])
def comprimir_foto(request):
    foto = request.FILES.get('foto')
    if not foto:
        return Response({'error': 'No se envió ninguna foto'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        img = Image.open(foto)
        img = img.convert('RGB')
        img.thumbnail((800, 800))
        
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=60, optimize=True)
        buffer.seek(0)
        
        img_str = base64.b64encode(buffer.read()).decode('utf-8')
        base64_url = f"data:image/jpeg;base64,{img_str}"
        
        return Response({'foto_vehiculo_base64': base64_url})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)