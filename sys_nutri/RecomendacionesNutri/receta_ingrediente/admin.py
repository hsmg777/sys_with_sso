from django.contrib import admin
from .models import RecetaIngrediente

@admin.register(RecetaIngrediente)
class RecetaIngredienteAdmin(admin.ModelAdmin):
    """
    Configuración independiente para gestionar Receta-Ingrediente desde su propia sección.
    """
    list_display = ('id', 'receta', 'ingrediente', 'cantidad', 'unidad')
    search_fields = ('receta__nombre', 'ingrediente__nombre')
    list_filter = ('unidad',)
