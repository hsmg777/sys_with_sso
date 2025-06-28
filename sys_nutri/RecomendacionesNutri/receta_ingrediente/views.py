from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RecetaIngrediente
from .serializers import RecetaIngredienteSerializer

class RecetaIngredienteListCreateView(APIView):
    """
    Vista para listar y crear relaciones Receta-Ing.
    """
    def get(self, request):
        relaciones = RecetaIngrediente.objects.all()
        serializer = RecetaIngredienteSerializer(relaciones, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecetaIngredienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
