from rest_framework import serializers
from .models import RecetaGuardada

class RecetaGuardadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetaGuardada
        fields = ['id', 'usuario', 'receta', 'fecha_guardado']
        read_only_fields = ['id', 'fecha_guardado']
