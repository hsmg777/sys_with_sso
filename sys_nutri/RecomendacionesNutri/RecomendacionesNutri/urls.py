from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.shortcuts import redirect

def redirect_to_admin(request):
    return redirect('/admin/')

# Configuración del esquema de Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="API de Recomendaciones Nutricionales",
        default_version='v1',
        description="Documentación interactiva de la API para el proyecto de recomendaciones nutricionales.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="soporte@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Apps
    path('api/auth/', include('my_auth.urls')),
    path('api/preferencias/', include('preferencias.urls')),
    path('api/ingredientes/', include('ingredientes.urls')),
    path('api/receta-ingredientes/', include('receta_ingrediente.urls')),
    path('api/recetas/', include('recetas.urls')),
    path('', redirect_to_admin),
    path('api/recetas-guardadas/', include('recetas_guardadas.urls')),

    # Swagger y Redoc
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
