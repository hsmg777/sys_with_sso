from django.db import models

class TipoReceta(models.Model):
    """
    Tipos de recetas (e.g., Desayuno, Almuerzo, Cena, etc.).
    """
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre
