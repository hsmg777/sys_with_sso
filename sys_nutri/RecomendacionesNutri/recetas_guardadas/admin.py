from django.contrib import admin
from .models import RecetaGuardada

@admin.register(RecetaGuardada)
class RecetaGuardadaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'receta', 'fecha_guardado')
    search_fields = ('usuario__username', 'receta__nombre')
