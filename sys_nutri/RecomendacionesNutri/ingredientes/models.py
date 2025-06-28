from categorias.models import Categoria
from django.db import models

class Ingrediente(models.Model):
    """
    Modelo para representar un ingrediente y sus valores nutricionales por cada 100 gramos.
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    calorias = models.FloatField(help_text="Calorías por cada 100 gramos")
    proteinas = models.FloatField(help_text="Proteínas (g) por cada 100 gramos")
    carbohidratos = models.FloatField(help_text="Carbohidratos (g) por cada 100 gramos")
    grasas = models.FloatField(help_text="Grasas (g) por cada 100 gramos")
    categoria = models.ForeignKey(
        'categorias.Categoria', on_delete=models.SET_NULL, null=True, related_name="ingredientes"
    )
    popularidad = models.IntegerField(default=0)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre
