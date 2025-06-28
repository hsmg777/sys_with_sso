from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import RecetaGuardada
from .serializers import RecetaGuardadaSerializer
from recetas.models import Receta
from django.utils.dateparse import parse_date
from django.db.models import Count

class RecetasGuardadasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recetas_guardadas = RecetaGuardada.objects.filter(usuario=request.user)
        serializer = RecetaGuardadaSerializer(recetas_guardadas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        receta_id = request.data.get('receta_id')  
        if not receta_id:
            return Response({'error': 'El ID de la receta es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receta = Receta.objects.get(id=receta_id)
        except Receta.DoesNotExist:
            return Response({'error': 'La receta no existe.'}, status=status.HTTP_404_NOT_FOUND)
        receta_guardada, created = RecetaGuardada.objects.get_or_create(usuario=request.user, receta=receta)

        if not created:
            return Response({'mensaje': 'La receta ya está guardada.'}, status=status.HTTP_200_OK)

        serializer = RecetaGuardadaSerializer(receta_guardada)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RecetasMasGuardadasView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        recetas_guardadas = RecetaGuardada.objects.all()
        if fecha_inicio:
            fecha_inicio = parse_date(fecha_inicio)
            if fecha_inicio:
                recetas_guardadas = recetas_guardadas.filter(fecha_guardado__gte=fecha_inicio)

        if fecha_fin:
            fecha_fin = parse_date(fecha_fin)
            if fecha_fin:
                recetas_guardadas = recetas_guardadas.filter(fecha_guardado__lte=fecha_fin)

        # Contar cuántas veces se ha guardado cada receta
        recetas_mas_guardadas = (
            recetas_guardadas
            .values('receta__id', 'receta__nombre')  # Agrupar por receta
            .annotate(total_guardadas=Count('id'))  # Contar ocurrencias
            .order_by('-total_guardadas')  # Ordenar por las más guardadas
        )

        return Response(recetas_mas_guardadas, status=status.HTTP_200_OK)
