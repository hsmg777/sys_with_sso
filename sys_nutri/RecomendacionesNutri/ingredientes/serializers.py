from rest_framework import serializers
from .models import Ingrediente

class IngredienteSerializer(serializers.ModelSerializer):
    """
    Serializador para manejar ingredientes.
    """
    class Meta:
        model = Ingrediente
        fields = ['id', 'nombre', 'descripcion', 'calorias', 'proteinas', 'carbohidratos', 'grasas', 'popularidad', 'creado_en', 'actualizado_en']
