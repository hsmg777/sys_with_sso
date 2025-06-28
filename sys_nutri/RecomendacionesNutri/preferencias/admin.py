from django.contrib import admin
from .models import PreferenciaAlimentaria

@admin.register(PreferenciaAlimentaria)
class PreferenciaAlimentariaAdmin(admin.ModelAdmin):
    """
    Configuración del administrador para PreferenciaAlimentaria.
    """
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)
    filter_horizontal = ('categorias_no_aptas',)  # Para gestionar las categorías no aptas
