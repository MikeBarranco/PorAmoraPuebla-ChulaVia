import base64
import os
from io import BytesIO
from PIL import Image
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Comunidad, Ruta, Solicitud, Transportista, Calificacion
from .serializers import ComunidadSerializer, RutaSerializer, SolicitudSerializer, TransportistaSerializer
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse, JsonResponse

def enviar_whatsapp(to, body):
    client = Client(os.environ.get('TWILIO_ACCOUNT_SID'), os.environ.get('TWILIO_AUTH_TOKEN'))
    client.messages.create(
        from_=os.environ.get('TWILIO_WHATSAPP_FROM'),
        to=to,
        body=body
    )

class ComunidadList(generics.ListAPIView):
    queryset = Comunidad.objects.all().order_by('municipio')
    serializer_class = ComunidadSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'es')
        return context

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

# Diccionario de mensajes multi-idioma (Español, Nahuatl, Totonaco)
MENSAJES = {
    'bienvenido': {
        'es':  '👋 ¡Bienvenido a ChulaVía!\n\nSelecciona tu idioma:\n1. Español\n2. Nahuatl\n3. Totonaco',
        'nah': '👋 Ximopanolti ChulaVía!\n\nXikchoa motlatol:\n1. Español\n2. Nahuatl\n3. Totonaco',
        'tot': '👋 Skalh tenk ChulaVía!\n\nKlhakgalhni xalakatsipi:\n1. Español\n2. Nahuatl\n3. Totonaco',
    },
    'pedir_origen': {
        'es':  '¿De dónde sales? Escribe el nombre de tu comunidad.',
        'nah': '¿Kampa tiwala? Xikijto itoka moaltepe.',
        'tot': '¿Niku tsukuya? Kawani xkuini minkachikin.',
    },
    'pedir_destino': {
        'es':  'Salida desde: {origen}\n¿A dónde vas?',
        'nah': 'Pejkayotl: {origen}\n¿Kampa tiyow?',
        'tot': 'Niku tsuku: {origen}\n¿Niku pina?',
    },
    'no_ruta': {
        'es':  'Aún no tenemos ruta de {origen} a {destino}.\nRegistramos tu solicitud.\n\nEscribe "hola" para buscar otra ruta.',
        'nah': 'Ayamo tikpia ojtli {origen} - {destino}.\nTikpixtok motlatlanilis.\n\nXikijto "hola" para xiktemo ocse.',
        'tot': 'Nina kgalhi ojtli {origen} - {destino}.\nLhaqawa tlajan.\n\nKawani "hola" kaputsati.',
    },
    'confirmado': {
        'es':  '✅ ¡Reservación confirmada!\n{nombre} te espera a las {hora}.\nContacto: {tel}\nPrecio: ${precio}',
        'nah': '✅ Momachtilito moojtli!\n{nombre} mitzchiyaz ika {hora}.\nTekixtli: {tel}\nIpatiw: ${precio}',
        'tot': '✅ Lhaqawa tlajan!\n{nombre} katchiya {hora}.\nTekil: {tel}\nXlakata: ${precio}',
    },
}

# Estado de las conversaciones (en memoria para el prototipo)
CONVERSACIONES = {}

@csrf_exempt
def whatsapp_webhook(request):
    mensaje = request.POST.get('Body', '').strip()
    numero = request.POST.get('From', '')
    resp = MessagingResponse()
    
    # 1. Obtener o crear conversación persistente
    from .models import WhatsAppConversation
    conve, _ = WhatsAppConversation.objects.get_or_create(wa_id=numero)
    
    # 2. Comando de reinicio
    if mensaje.lower() in ['hola', 'inicio', 'menu', 'menú', 'hi']:
        conve.paso = 'elegir_idioma'
        conve.save()
        resp.message(MENSAJES['bienvenido']['es'])
        return HttpResponse(str(resp), content_type='text/xml')

    # 3. Flujo de Calificación (ya existente pero adaptado)
    if conve.paso == 'esperando_calificacion':
        if mensaje in ['1', '2', '3', '4', '5']:
            puntuacion = int(mensaje)
            try:
                # Usamos el ruta_id_temp para guardar la calificación
                if conve.ruta_id_temp:
                    Calificacion.objects.create(
                        ruta_id=conve.ruta_id_temp,
                        solicitud_id=conve.destino_temp, # Reutilizamos campo temporalmente si no hay ID
                        puntuacion=puntuacion
                    )
            except: pass
            conve.paso = 'inicio'
            conve.save()
            resp.message("¡Gracias! Registramos tu calificación. ⭐\nEscribe 'hola' para iniciar de nuevo.")
        else:
            resp.message("Por favor responde con un número del 1 al 5.")
        return HttpResponse(str(resp), content_type='text/xml')

    # 4. Flujo Principal del Bot
    paso = conve.paso
    
    if paso == 'elegir_idioma':
        idioma_map = {'1': 'es', '2': 'nah', '3': 'tot'}
        idioma = idioma_map.get(mensaje, 'es')
        conve.paso = 'buscando_origen'
        conve.origen_temp = idioma # Guardamos idioma temporalmente aquí
        conve.save()
        resp.message(MENSAJES['pedir_origen'][idioma])

    elif paso == 'buscando_origen':
        idioma = conve.origen_temp or 'es'
        conve.origen_temp = mensaje
        conve.paso = 'buscando_destino'
        conve.save()
        resp.message(MENSAJES['pedir_destino'][idioma].format(origen=mensaje))

    elif paso == 'buscando_destino':
        idioma = 'es' # Por simplicidad en este paso
        origen_txt = conve.origen_temp
        destino_txt = mensaje
        
        # Buscar comunidades que coincidan
        comu_origen = Comunidad.objects.filter(nombre__icontains=origen_txt).first()
        comu_destino = Comunidad.objects.filter(nombre__icontains=destino_txt).first()
        
        if comu_origen and comu_destino:
            # Buscar rutas reales
            rutas = Ruta.objects.filter(origen=comu_origen, destino=comu_destino, activa=True)
            if rutas.exists():
                ruta = rutas.first()
                import random
                folio = f"CVA-2026-{random.randint(1000, 9999)}"
                
                # Crear reservación real
                from datetime import date
                Solicitud.objects.create(
                    origen_texto=comu_origen.nombre,
                    destino_texto=comu_destino.nombre,
                    ruta=ruta,
                    telefono_whatsapp=numero,
                    fecha_viaje=date.today(), # Por ahora hoy
                    estado='confirmada'
                )
                
                msg = MENSAJES['confirmado'][idioma].format(
                    nombre=ruta.transportista.nombre,
                    hora=ruta.horarios[0] if ruta.horarios else "10:00",
                    tel=ruta.transportista.telefono,
                    precio=ruta.precio
                )
                resp.message(f"{msg}\n\n📋 Folio: {folio}")
                conve.paso = 'inicio'
                conve.save()
            else:
                resp.message(MENSAJES['no_ruta'][idioma].format(origen=origen_txt, destino=destino_txt))
                conve.paso = 'inicio'
                conve.save()
        else:
            resp.message(f"🤔 No encontré alguna de esas comunidades. Asegúrate de escribir bien el nombre (ej: Tehuitzingo).\n\nEscribe 'hola' para intentar de nuevo.")
            conve.paso = 'inicio'
            conve.save()

    else:
        resp.message("Lo siento, no entendí bien eso. 🤔\n\nEscribe *Hola* para iniciar.")
        conve.paso = 'inicio'
        conve.save()

    return HttpResponse(str(resp), content_type='text/xml')


@csrf_exempt
@require_POST
def completar_solicitud(request, solicitud_id):
    try:
        solicitud = Solicitud.objects.get(id=solicitud_id)
        solicitud.estado = 'completada'
        solicitud.save()

        # Guardar en CONVERSACIONES que este número espera calificación
        CONVERSACIONES[solicitud.telefono_whatsapp] = {
            'paso': 'esperando_calificacion',
            'solicitud_id': solicitud.id,
            'ruta_id': solicitud.ruta_id,
        }

        # Mandar WhatsApp al pasajero
        origen = solicitud.origen_texto
        destino = solicitud.destino_texto
        enviar_whatsapp(
            solicitud.telefono_whatsapp,
            f"¡Gracias por viajar con ChulaVía!\n\n"
            f"Tu viaje de {origen} a {destino} ha concluido.\n\n"
            f"¿Cómo estuvo el servicio? Responde con un número:\n"
            f"5 ⭐⭐⭐⭐⭐ Excelente\n"
            f"4 ⭐⭐⭐⭐ Muy bueno\n"
            f"3 ⭐⭐⭐ Regular\n"
            f"2 ⭐⭐ Malo\n"
            f"1 ⭐ Muy malo\n\n"
            f"Puedes agregar un comentario en español, náhuatl o totonaco."
        )
        return JsonResponse({'ok': True})
    except Solicitud.DoesNotExist:
        return JsonResponse({'error': 'No encontrada'}, status=404)

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