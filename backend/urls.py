from django.contrib import admin
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
]
