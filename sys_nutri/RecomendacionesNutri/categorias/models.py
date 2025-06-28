from django.db import models

class Categoria(models.Model):
    """
    Categorías para clasificar ingredientes (e.g., Carne, Vegetales, etc.).
    """
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre
