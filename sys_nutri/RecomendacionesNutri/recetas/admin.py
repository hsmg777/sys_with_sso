from django.contrib import admin
from .models import Receta
from receta_ingrediente.models import RecetaIngrediente

class RecetaIngredienteInline(admin.TabularInline):
    """
    Inline para manejar la relación Receta-Ingrediente desde el administrador.
    """
    model = RecetaIngrediente
    extra = 1  # Muestra al menos una fila en blanco
    autocomplete_fields = ['ingrediente']  # Facilita la búsqueda de ingredientes
    fields = ('ingrediente', 'cantidad', 'unidad')  # Campos visibles en el Inline
    verbose_name = "Ingrediente"
    verbose_name_plural = "Ingredientes"

@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    """
    Configuración del administrador para Recetas con Inline para ingredientes.
    """
    list_display = (
        'id', 'nombre', 'popularidad', 'tiempo_preparacion', 
        'tiempo_coccion', 'porciones', 'valores_nutricionales_totales', 'creado_en'
    )
    search_fields = ('nombre',)
    list_filter = ('creado_en', 'actualizado_en')
    ordering = ('-popularidad', 'nombre')
    inlines = [RecetaIngredienteInline]

    def valores_nutricionales_totales(self, obj):
        """
        Mostrar los valores nutricionales en el admin.
        """
        valores = obj.valores_nutricionales
        return (
            f"Calorías: {valores['calorias']} | "
            f"Proteínas: {valores['proteinas']}g | "
            f"Carbohidratos: {valores['carbohidratos']}g | "
            f"Grasas: {valores['grasas']}g"
        )

    valores_nutricionales_totales.short_description = "Valores Nutricionales"
