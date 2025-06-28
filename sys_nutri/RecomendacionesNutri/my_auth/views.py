from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UsuarioSerializer
from my_auth.models import Usuario
from my_auth.keycloak import require_token
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class UserProfileView(APIView):
    """
    Vista protegida por Keycloak para obtener o actualizar el perfil del usuario autenticado.
    """

    @require_token
    def get(self, request):
        email = request.keycloak_user.get("email")
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    @require_token
    def put(self, request):
        email = request.keycloak_user.get("email")
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "email", "password", "nombres", "apellidos", "altura", "peso"],
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING),
                "email": openapi.Schema(type=openapi.TYPE_STRING),
                "password": openapi.Schema(type=openapi.TYPE_STRING),
                "nombres": openapi.Schema(type=openapi.TYPE_STRING),
                "apellidos": openapi.Schema(type=openapi.TYPE_STRING),
                "altura": openapi.Schema(type=openapi.TYPE_NUMBER),
                "peso": openapi.Schema(type=openapi.TYPE_NUMBER),
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
        ⚠️ Registro local (útil solo si se usa en conjunto con Keycloak).
        """
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Usuario registrado exitosamente."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MisMacronutrientesView(APIView):
    """
    Vista protegida por Keycloak para obtener las necesidades de macronutrientes
    del usuario actual, incluyendo los valores máximos y mínimos.
    """

    @require_token
    def get(self, request):
        keycloak_user = request.keycloak_user
        email = keycloak_user.get("email")

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no registrado localmente."},
                status=status.HTTP_404_NOT_FOUND
            )

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
