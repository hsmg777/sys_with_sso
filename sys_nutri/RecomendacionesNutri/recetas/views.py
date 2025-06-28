from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Receta
from .serializers import RecetaSerializer
from ingredientes.models import Ingrediente
from rest_framework.permissions import IsAuthenticated

class RecetaListCreateView(APIView):
    """
    Vista para listar y crear recetas.
    """
    def get(self, request):
        recetas = Receta.objects.all().order_by('nombre')  # Ordenar por nombre
        serializer = RecetaSerializer(recetas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecetaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecetaDetailView(APIView):
    """
    Vista para recuperar, actualizar y eliminar una receta específica.
    """
    def get(self, request, pk):
        try:
            receta = Receta.objects.get(pk=pk)
            serializer = RecetaSerializer(receta)
            return Response(serializer.data)
        except Receta.DoesNotExist:
            return Response({"error": "Receta no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            receta = Receta.objects.get(pk=pk)
            serializer = RecetaSerializer(receta, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Receta.DoesNotExist:
            return Response({"error": "Receta no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            receta = Receta.objects.get(pk=pk)
            receta.delete()
            return Response({"mensaje": "Receta eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)
        except Receta.DoesNotExist:
            return Response({"error": "Receta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
class RecomendacionRecetasView(APIView):
    """
    Vista para recomendar recetas según los ingredientes seleccionados (despensa)
    y las preferencias alimentarias del usuario.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Ingredientes seleccionados por el usuario
        ingredientes_ids = request.data.get('ingredientes', [])
        usuario = request.user  # Usuario autenticado

        if not ingredientes_ids:
            return Response({"error": "Debe seleccionar al menos un ingrediente."}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener los ingredientes seleccionados
        ingredientes = Ingrediente.objects.filter(id__in=ingredientes_ids)
        if not ingredientes.exists():
            return Response({"error": "No se encontraron ingredientes válidos."}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar recetas que contienen ingredientes de la despensa
        recetas = Receta.objects.filter(
            receta_ingredientes__ingrediente__in=ingredientes
        ).distinct().prefetch_related('receta_ingredientes__ingrediente', 'receta_ingredientes__ingrediente__categoria')

        # Identificar categorías no aptas según las preferencias alimentarias del usuario
        preferencias = usuario.preferencias_alimentarias.all()
        categorias_no_aptas = set()
        for preferencia in preferencias:
            categorias_no_aptas.update(preferencia.categorias_no_aptas.all())

        # Construir la respuesta con la información de aptitud y razones
        recomendaciones = []
        for receta in recetas:
            receta_ingredientes = receta.receta_ingredientes.all()

            # Separar ingredientes disponibles y faltantes
            disponibles = [ri.ingrediente for ri in receta_ingredientes if ri.ingrediente in ingredientes]
            faltantes = [ri.ingrediente for ri in receta_ingredientes if ri.ingrediente not in ingredientes]

            # Determinar si la receta es apta y por qué no lo es
            razones_no_apta = []
            for ri in receta_ingredientes:
                if ri.ingrediente.categoria in categorias_no_aptas:
                    razones_no_apta.append(
                        f"El ingrediente '{ri.ingrediente.nombre}' pertenece a la categoría '{ri.ingrediente.categoria.nombre}', "
                        f"que no es compatible con tus preferencias alimenticias."
                    )

            es_apta = len(razones_no_apta) == 0

            # Agregar la receta a las recomendaciones
            recomendaciones.append({
                "id": receta.id,  # Incluye el ID de la receta
                "receta": receta.nombre,
                "ingredientes_disponibles": [ing.nombre for ing in disponibles],
                "ingredientes_faltantes": [ing.nombre for ing in faltantes],
                "es_apta": es_apta,  # True si es apta, False si no
                "razones_no_apta": razones_no_apta if not es_apta else []  # Incluye razones si no es apta
            })

        if not recomendaciones:
            return Response({"mensaje": "No se encontraron recetas con los ingredientes seleccionados."}, status=status.HTTP_200_OK)

        return Response(recomendaciones, status=status.HTTP_200_OK)
    
class RecomendacionNutricionalView(APIView):
    """
    Vista para recomendar recetas basadas en el IMC y los macronutrientes del usuario.
    """
    def get(self, request):
        usuario = request.user  # Usuario autenticado

        # Validar si el usuario tiene datos necesarios
        if not usuario.altura or not usuario.peso:
            return Response(
                {"error": "Faltan datos de altura o peso para calcular recomendaciones."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener IMC, mínimos y máximos desde el modelo Usuario
        imc = usuario.imc
        minimos = usuario.get_minimos()
        maximos = usuario.get_maximos()

        # Filtrar recetas relevantes según valores nutricionales
        recetas = Receta.objects.prefetch_related('receta_ingredientes__ingrediente')

        recomendaciones = []
        for receta in recetas:
            receta_nutricion = receta.valores_nutricionales

            # Determinar razones por las que no es apta
            razones_no_apta = []

            # Validar calorías
            if receta_nutricion["calorias"] < minimos["calorias"]:
                razones_no_apta.append(
                    f"Calorías insuficientes: {receta_nutricion['calorias']} kcal < {minimos['calorias']} kcal."
                )
            if receta_nutricion["calorias"] > maximos["calorias"]:
                razones_no_apta.append(
                    f"Calorías excesivas: {receta_nutricion['calorias']} kcal > {maximos['calorias']} kcal."
                )

            # Validar proteínas
            if receta_nutricion["proteinas"] < minimos["proteinas"]:
                razones_no_apta.append(
                    f"Proteínas insuficientes: {receta_nutricion['proteinas']} g < {minimos['proteinas']} g."
                )
            if receta_nutricion["proteinas"] > maximos["proteinas"]:
                razones_no_apta.append(
                    f"Proteínas excesivas: {receta_nutricion['proteinas']} g > {maximos['proteinas']} g."
                )

            # Validar carbohidratos
            if receta_nutricion["carbohidratos"] < minimos["carbohidratos"]:
                razones_no_apta.append(
                    f"Carbohidratos insuficientes: {receta_nutricion['carbohidratos']} g < {minimos['carbohidratos']} g."
                )
            if receta_nutricion["carbohidratos"] > maximos["carbohidratos"]:
                razones_no_apta.append(
                    f"Carbohidratos excesivos: {receta_nutricion['carbohidratos']} g > {maximos['carbohidratos']} g."
                )

            # Validar grasas
            if receta_nutricion["grasas"] < minimos["grasas"]:
                razones_no_apta.append(
                    f"Grasas insuficientes: {receta_nutricion['grasas']} g < {minimos['grasas']} g."
                )
            if receta_nutricion["grasas"] > maximos["grasas"]:
                razones_no_apta.append(
                    f"Grasas excesivas: {receta_nutricion['grasas']} g > {maximos['grasas']} g."
                )

            es_apta_por_macronutrientes = len(razones_no_apta) == 0

            recomendaciones.append({
                "receta": receta.nombre,
                "valores_nutricionales": receta_nutricion,
                "es_apta_por_macronutrientes": es_apta_por_macronutrientes,
                "razones_no_apta": razones_no_apta,  # Añadimos las razones
            })

        if not recomendaciones:
            return Response(
                {"mensaje": "No se encontraron recetas aptas para tus necesidades nutricionales."},
                status=status.HTTP_200_OK
            )

        return Response(recomendaciones, status=status.HTTP_200_OK)