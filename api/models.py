from django.db import models

class Comunidad(models.Model):
    nombre = models.CharField(max_length=200)
    nombre_nahuatl = models.CharField(max_length=200, blank=True, null=True)
    nombre_totonaco = models.CharField(max_length=200, blank=True, null=True)
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
    foto_vehiculo_base64 = models.TextField(blank=True, help_text="Imagen comprimida en Base64")
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
    telefono_whatsapp = models.CharField(max_length=30)
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
    fecha = models.DateTimeField(auto_now_add=True)