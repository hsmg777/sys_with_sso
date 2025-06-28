# recetas/factories.py

from .models import Receta
from ingredientes.models import Ingrediente
from receta_ingrediente.models import RecetaIngrediente

class RecetaFactory:
    """
    Factory para encapsular la creación de Recetas
    con algunos ingredientes por defecto o configurables.
    """

    @staticmethod
    def crear_receta_basica(nombre="Receta Básica", ingredientes=None):
        # Creamos la receta
        receta = Receta.objects.create(
            nombre=nombre,
            descripcion="Descripción de la receta básica",
            tiempo_preparacion=10,
            tiempo_coccion=10,
            porciones=2,
            popularidad=5
        )

        # Si nos pasan una lista de ingredientes, los agregamos
        if ingredientes:
            for ing_data in ingredientes:
                # ing_data podría ser un dict del estilo:
                # {"ingrediente": <Ingrediente>, "cantidad": 200, "unidad": "gramos"}
                RecetaIngrediente.objects.create(
                    receta=receta,
                    ingrediente=ing_data["ingrediente"],
                    cantidad=ing_data["cantidad"],
                    unidad=ing_data["unidad"]
                )

        return receta
