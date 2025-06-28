from django.contrib import admin
from .models import TipoReceta

@admin.register(TipoReceta)
class TipoRecetaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)
