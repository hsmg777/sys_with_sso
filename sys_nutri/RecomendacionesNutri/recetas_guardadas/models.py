from django.db import models
from django.contrib.auth import get_user_model
from recetas.models import Receta

User = get_user_model()

class RecetaGuardada(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recetas_guardadas')
    receta = models.ForeignKey(Receta, on_delete=models.CASCADE, related_name='guardada_por')
    fecha_guardado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'receta')  # Evitar duplicados a nivel de base de datos

    def __str__(self):
        return f"{self.usuario.username} - {self.receta.nombre}"
