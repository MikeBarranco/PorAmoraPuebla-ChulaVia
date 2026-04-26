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
    mensaje = request.POST.get('Body', '').lower().strip()
    numero = request.POST.get('From', '')
    resp = MessagingResponse()
    msg = resp.message()

    # Obtener el estado actual del usuario
    estado = CONVERSACIONES.get(numero, {'paso': 'inicio'})

    # Flujo post-viaje: calificación
    if estado.get('paso') == 'esperando_calificacion':
        if mensaje in ['1', '2', '3', '4', '5']:
            puntuacion = int(mensaje)
            solicitud_id = estado.get('solicitud_id')
            ruta_id = estado.get('ruta_id')

            # Guardar calificación
            try:
                solicitud = Solicitud.objects.get(id=solicitud_id)
                Calificacion.objects.create(
                    ruta_id=ruta_id,
                    solicitud=solicitud,
                    puntuacion=puntuacion,
                    comentario=''
                )

                # Recalcular promedio del transportista
                if ruta_id:
                    from django.db.models import Avg
                    ruta = Ruta.objects.get(id=ruta_id)
                    nuevo_promedio = Calificacion.objects.filter(
                        ruta__transportista=ruta.transportista
                    ).aggregate(Avg('puntuacion'))['puntuacion__avg']
                    ruta.transportista.calificacion = round(nuevo_promedio, 2)
                    ruta.transportista.total_viajes += 1
                    ruta.transportista.save()
            except Exception:
                pass

            CONVERSACIONES[numero] = {'paso': 'esperando_comentario', 'solicitud_id': solicitud_id, 'ruta_id': ruta_id, 'puntuacion': puntuacion}
            estrellas = '⭐' * puntuacion
            msg.body(f"¡Gracias! Registramos {estrellas}\n\n¿Quieres dejar un comentario? Escríbelo ahora (en español, náhuatl o totonaco), o escribe 'no' para terminar.")
        else:
            msg.body("Por favor responde con un número del 1 al 5 para calificar tu viaje.")
        return HttpResponse(str(resp), content_type='text/xml')

    if estado.get('paso') == 'esperando_comentario':
        solicitud_id = estado.get('solicitud_id')
        ruta_id = estado.get('ruta_id')
        puntuacion = estado.get('puntuacion', 5)

        if mensaje.lower() != 'no' and len(mensaje) > 1:
            try:
                cal = Calificacion.objects.filter(solicitud_id=solicitud_id).last()
                if cal:
                    cal.comentario = mensaje
                    cal.save()
            except Exception:
                pass

        CONVERSACIONES[numero] = {'paso': 'inicio'}
        msg.body("¡Gracias por tu opinión! Nos ayuda a mejorar el servicio para toda la comunidad. 🙏\n\nEscribe 'hola' para hacer otra búsqueda.")
        return HttpResponse(str(resp), content_type='text/xml')

    # 1. Inicio / Reiniciar
    if mensaje in ['hola', 'hola!', 'hi', 'inicio', 'menu', 'menú']:
        CONVERSACIONES[numero] = {'paso': 'elegir_idioma'}
        msg.body(MENSAJES['bienvenido']['es'])

    # 2. Elegir Idioma
    elif estado['paso'] == 'elegir_idioma':
        idioma_map = {'1': 'es', '2': 'nah', '3': 'tot'}
        idioma = idioma_map.get(mensaje, 'es')
        CONVERSACIONES[numero] = {'paso': 'pedir_origen', 'idioma': idioma}
        msg.body(MENSAJES['pedir_origen'][idioma])

    # 3. Pedir Origen
    elif estado['paso'] == 'pedir_origen':
        idioma = estado.get('idioma', 'es')
        CONVERSACIONES[numero] = {
            'paso': 'pedir_destino',
            'origen': mensaje,
            'idioma': idioma
        }
        msg.body(MENSAJES['pedir_destino'][idioma].format(origen=mensaje))

    # 4. Pedir Destino y Simular Búsqueda
    elif estado['paso'] == 'pedir_destino':
        idioma = estado.get('idioma', 'es')
        origen = estado.get('origen', '')
        destino = mensaje

        if 'puebla' in destino or 'izucar' in destino:
            msg.body(MENSAJES['confirmado'][idioma].format(
                nombre='Ernesto García',
                hora='17:00',
                tel='222-123-4567',
                precio='35'
            ))
            CONVERSACIONES[numero] = {'paso': 'inicio'}
        else:
            msg.body(MENSAJES['no_ruta'][idioma].format(origen=origen, destino=destino))
            CONVERSACIONES[numero] = {'paso': 'inicio'}

    # 5. Fallback
    else:
        msg.body("Lo siento, no entendí bien eso. 🤔\n\nEscribe *Hola* para iniciar.")
        CONVERSACIONES[numero] = {'paso': 'inicio'}

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