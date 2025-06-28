from django.db import models
from ingredientes.models import Ingrediente
from tipos_recetas.models import TipoReceta
from .services import RecetaNutricionalService

class Receta(models.Model):
    """
    Modelo para representar una receta.
    """
    nombre = models.CharField(max_length=150, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='recetas/', blank=True, null=True)
    tiempo_preparacion = models.PositiveIntegerField()
    tiempo_coccion = models.PositiveIntegerField()
    porciones = models.PositiveIntegerField(default=1)
    popularidad = models.IntegerField(default=0)
    tipo = models.ForeignKey(TipoReceta, on_delete=models.SET_NULL, null=True, related_name="recetas")  # Relación con TipoReceta
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    ingredientes = models.ManyToManyField(
        Ingrediente,
        through='receta_ingrediente.RecetaIngrediente',
        related_name='recetas'
    )  # Relación ManyToMany con ingredientes a través de RecetaIngrediente

    def __str__(self):
        return self.nombre
    

    @property
    def valores_nutricionales(self):
        """
        Delegamos el cálculo a nuestro servicio, cumpliendo SRP.
        """
        return RecetaNutricionalService.calcular_valores_nutricionales(self)