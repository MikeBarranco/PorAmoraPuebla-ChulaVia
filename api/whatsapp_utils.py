import os
from twilio.rest import Client
from django.conf import settings

def send_whatsapp_message(to_number, message_body):
    """
    Envía un mensaje de WhatsApp usando la API de Twilio.
    to_number: El número del destinatario (debe incluir el prefijo del país, ej: +521222...)
    message_body: El texto que quieres enviar.
    """
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    # Asegurarse de que el número tenga el formato correcto para WhatsApp
    if not to_number.startswith('whatsapp:'):
        to_number = f'whatsapp:{to_number}'
        
    from_number = f'whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}'
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        print(f"Mensaje enviado exitosamente. SID: {message.sid}")
        return message.sid
    except Exception as e:
        print(f"Error enviando mensaje: {e}")
        return None
