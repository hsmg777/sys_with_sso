from categorias.models import Categoria
from django.db import models

class PreferenciaAlimentaria(models.Model):
    """
    Modelo que representa las preferencias alimentarias.
    Ejemplo: Vegetariano, Vegano, Sin Gluten.
    """
    nombre = models.CharField(max_length=100, unique=True)
    categorias_no_aptas = models.ManyToManyField(Categoria, related_name="preferencias", blank=True)

    def __str__(self):
        return self.nombre
