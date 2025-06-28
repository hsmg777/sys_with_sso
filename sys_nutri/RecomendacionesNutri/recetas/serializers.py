from rest_framework import serializers
from .models import Receta

class RecetaSerializer(serializers.ModelSerializer):
    """
    Serializador para manejar recetas.
    """
    valores_nutricionales = serializers.ReadOnlyField()  # Propiedad calculada

    class Meta:
        model = Receta
        fields = [
            'id', 'nombre', 'descripcion', 'imagen', 'tiempo_preparacion',
            'tiempo_coccion', 'porciones', 'popularidad', 'valores_nutricionales',
            'creado_en', 'actualizado_en'
        ]
