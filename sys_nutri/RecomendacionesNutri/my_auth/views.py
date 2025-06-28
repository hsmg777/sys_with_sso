from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Obtener el perfil del usuario autenticado.
        """
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        """
        Actualiza los datos del perfil del usuario autenticado.
        """
        usuario = request.user
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "email", "password", "nombres", "apellidos", "altura", "peso"],
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="Nombre de usuario único."),
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Correo electrónico único."),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="Contraseña del usuario."),
                "nombres": openapi.Schema(type=openapi.TYPE_STRING, description="Nombres del usuario."),
                "apellidos": openapi.Schema(type=openapi.TYPE_STRING, description="Apellidos del usuario."),
                "altura": openapi.Schema(type=openapi.TYPE_NUMBER, description="Altura en metros."),
                "peso": openapi.Schema(type=openapi.TYPE_NUMBER, description="Peso en kilogramos."),
                "preferencias_ids": openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_INTEGER),
                    description="Lista de IDs de preferencias alimentarias.",
                ),
            },
        ),
        responses={
            201: openapi.Response("Usuario registrado exitosamente."),
            400: openapi.Response("Error en los datos enviados."),
        },
    )
    def post(self, request):
        """
        Registro de usuario. Este servicio espera un JSON con los siguientes datos:
        {
            "username": "string",
            "email": "string",
            "password": "string",
            "nombres": "string",
            "apellidos": "string",
            "altura": float,
            "peso": float,
            "preferencias_ids": [int, int, ...]
        }
        """
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Usuario registrado exitosamente."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["email", "password"],
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Correo electrónico del usuario."),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="Contraseña del usuario."),
            },
        ),
        responses={
            200: openapi.Response("Tokens de autenticación generados."),
            401: openapi.Response("Credenciales inválidas."),
        },
    )
    def post(self, request):
        """
        Inicio de sesión del usuario. Este servicio espera un JSON con los siguientes datos:
        {
            "email": "string",
            "password": "string"
        }
        """
        email = request.data.get('email')
        password = request.data.get('password')

        # Validar que se envían ambos campos
        if not email or not password:
            return Response(
                {"mensaje": "Debe proporcionar un correo y una contraseña."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Buscar usuario por correo electrónico
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({"mensaje": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        # Verificar contraseña
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )

        return Response({"mensaje": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
    
class MisMacronutrientesView(APIView):
    """
    Vista para obtener las necesidades de macronutrientes del usuario actual,
    incluyendo los valores máximos y mínimos.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user  # Usuario autenticado

        # Validar si el usuario tiene peso para calcular
        if not usuario.peso:
            return Response(
                {"error": "Es necesario tener un peso registrado para calcular macronutrientes."},
                status=status.HTTP_400_BAD_REQUEST
            )

        necesidades = usuario.macronutrientes
        if not necesidades:
            return Response(
                {"error": "No se han calculado las necesidades de macronutrientes para este usuario."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener mínimos y máximos desde el modelo
        minimos = usuario.get_minimos()
        maximos = usuario.get_maximos()

        return Response(
            {
                "necesidades": necesidades,
                "minimos": minimos,
                "maximos": maximos,
            },
            status=status.HTTP_200_OK
        )