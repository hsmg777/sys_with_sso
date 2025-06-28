from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PreferenciaAlimentaria
from .serializers import PreferenciaAlimentariaSerializer

class PreferenciaAlimentariaList(APIView):
    def get(self, request):
        preferencias = PreferenciaAlimentaria.objects.all()
        serializer = PreferenciaAlimentariaSerializer(preferencias, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PreferenciaAlimentariaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
