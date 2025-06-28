from rest_framework import serializers
from .models import Usuario
from preferencias.models import PreferenciaAlimentaria
from preferencias.serializers import PreferenciaAlimentariaSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializador para el perfil del usuario.
    Incluye manejo de macronutrientes y preferencias alimentarias.
    """
    preferencias_alimentarias = PreferenciaAlimentariaSerializer(many=True, read_only=True)
    preferencias_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'nombres', 'apellidos',
            'altura', 'peso', 'macronutrientes', 'imc',
            'preferencias_alimentarias', 'preferencias_ids',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        if self.instance:  # Actualización de un usuario existente
            if Usuario.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("El correo ya está registrado por otro usuario.")
        else:  # Creación de un nuevo usuario
            if Usuario.objects.filter(email=value).exists():
                raise serializers.ValidationError("El correo ya está registrado VALIDACIÓN PROPIA.")
        return value

    def create(self, validated_data):
        """
        Método para crear un usuario con preferencias alimentarias.
        """
        # Extraer y cifrar la contraseña
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "Este campo es requerido."})

        validated_data['password'] = make_password(password)

        # Extraer preferencias alimentarias
        preferencias_ids = validated_data.pop('preferencias_ids', [])
        usuario = super().create(validated_data)  # Crear el usuario

        # Asignar preferencias alimentarias si se proporcionaron
        if preferencias_ids:
            preferencias = PreferenciaAlimentaria.objects.filter(id__in=preferencias_ids)
            usuario.preferencias_alimentarias.set(preferencias)

        # Recalcular macronutrientes y calcular IMC después de la creación
        usuario.recalcular_macronutrientes()
        usuario.imc = usuario.calcular_imc()
        usuario.save(update_fields=["imc", "macronutrientes"])

        return usuario

    def update(self, instance, validated_data):
        """
        Método para actualizar un usuario y sus preferencias alimentarias.
        """
        # Manejar las preferencias alimentarias
        preferencias_ids = validated_data.pop('preferencias_ids', None)
        if preferencias_ids is not None:
            preferencias = PreferenciaAlimentaria.objects.filter(id__in=preferencias_ids)
            instance.preferencias_alimentarias.set(preferencias)

        # Manejar la actualización de la contraseña si está presente
        password = validated_data.pop('password', None)
        if password:
            instance.password = make_password(password)

        # Actualizar el resto de los campos
        instance = super().update(instance, validated_data)

        # Recalcular macronutrientes e IMC si el peso o la altura cambian
        if 'peso' in validated_data or 'altura' in validated_data:
            instance.recalcular_macronutrientes()
            instance.imc = instance.calcular_imc()
            instance.save(update_fields=["imc", "macronutrientes"])

        return instance


class LoginSerializer(serializers.Serializer):
    """
    Serializador para el inicio de sesión.
    Valida solo email y contraseña.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Método para validar credenciales de inicio de sesión.
        """
        email = data.get('email')
        password = data.get('password')

        if email and password:
            # Autenticar usuario por email
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Credenciales inválidas.")
            data['user'] = user
        else:
            raise serializers.ValidationError("Debes proporcionar un correo y una contraseña.")
        return data
