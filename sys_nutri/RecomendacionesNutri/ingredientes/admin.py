from django.contrib import admin
from .models import Ingrediente

@admin.register(Ingrediente)
class IngredienteAdmin(admin.ModelAdmin):
    """
    Configuración del administrador para Ingredientes.
    """
    list_display = ('id', 'nombre', 'calorias', 'proteinas', 'carbohidratos', 'grasas', 'popularidad', 'creado_en', 'actualizado_en')
    search_fields = ('nombre',)  # Campo de búsqueda por nombre
    list_filter = ('creado_en', 'actualizado_en')  # Filtros por fechas
    ordering = ('-popularidad', 'nombre')  # Ordenar por popularidad descendente y nombre
