from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Ingrediente
from .serializers import IngredienteSerializer

class IngredienteListCreateView(APIView):
    """
    Vista para listar y crear ingredientes.
    """
    def get(self, request):
        ingredientes = Ingrediente.objects.all().order_by('nombre')  # Ordenar por nombre
        serializer = IngredienteSerializer(ingredientes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IngredienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class IngredienteDetailView(APIView):
    """
    Vista para obtener el detalle de un ingrediente por su ID.
    """
    def get(self, request, pk):
        try:
            ingrediente = Ingrediente.objects.get(pk=pk)
            serializer = IngredienteSerializer(ingrediente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Ingrediente.DoesNotExist:
            return Response(
                {"error": "El ingrediente no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
