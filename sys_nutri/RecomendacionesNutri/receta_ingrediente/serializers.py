from rest_framework import serializers
from .models import RecetaIngrediente

class RecetaIngredienteSerializer(serializers.ModelSerializer):
    """
    Serializador para manejar la relación Receta-Ing.
    """
    class Meta:
        model = RecetaIngrediente
        fields = ['id', 'receta', 'ingrediente', 'cantidad', 'unidad']
