from rest_framework import serializers
from .models import PreferenciaAlimentaria

class PreferenciaAlimentariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferenciaAlimentaria
        fields = ['id', 'nombre']
