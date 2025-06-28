from django.db import models
from recetas.models import Receta
from ingredientes.models import Ingrediente

class RecetaIngrediente(models.Model):
    """
    Modelo intermedio para representar la relación entre recetas e ingredientes.
    Incluye la cantidad y la unidad de cada ingrediente en la receta.
    """
    UNIDADES_CHOICES = [
        ('gramos', 'Gramos'),
        ('kilogramos', 'Kilogramos'),
        ('mililitros', 'Mililitros'),
        ('litros', 'Litros'),
        ('rebanadas', 'Rebanadas'),
        ('piezas', 'Piezas'),
        ('tazas', 'Tazas'),
        ('cucharadas', 'Cucharadas'),
        ('cucharaditas', 'Cucharaditas'),
    ]

    receta = models.ForeignKey(Receta, on_delete=models.CASCADE, related_name='receta_ingredientes')
    ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE, related_name='ingrediente_recetas')
    cantidad = models.FloatField()  # Cantidad del ingrediente en la receta
    unidad = models.CharField(max_length=50, choices=UNIDADES_CHOICES, default='gramos')  # Unidad de medida

    def __str__(self):
        return f"{self.cantidad} {self.unidad} de {self.ingrediente.nombre} en {self.receta.nombre}"
