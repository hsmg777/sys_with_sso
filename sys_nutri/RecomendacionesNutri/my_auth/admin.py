from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Información personal', {'fields': ('nombres', 'apellidos', 'altura', 'peso', 'imc', 'macronutrientes', 'preferencias_alimentarias')}),
    )
    list_display = (
        'username',
        'email',
        'nombres',
        'apellidos',
        'imc',  # Mostrar el IMC en la lista
        'macronutrientes_totales',  # Mostrar macronutrientes en formato legible
        'is_staff'
    )
    search_fields = ('username', 'email', 'nombres', 'apellidos')
    ordering = ('email',)

    def macronutrientes_totales(self, obj):
        """
        Mostrar macronutrientes calculados en formato legible.
        """
        if obj.macronutrientes:
            return (
                f"Proteínas: {obj.macronutrientes['proteinas']}g | "
                f"Carbohidratos: {obj.macronutrientes['carbohidratos']}g | "
                f"Grasas: {obj.macronutrientes['grasas']}g"
            )
        return "Datos insuficientes"

    macronutrientes_totales.short_description = "Macronutrientes"
    
admin.site.register(Usuario, UsuarioAdmin)
