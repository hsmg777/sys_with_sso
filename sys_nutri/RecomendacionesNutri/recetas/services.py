# recetas/services.py

# 1) Elimina esta línea: from .models import Receta
# para evitar el import cíclico

class RecetaNutricionalService:
    """
    Servicio para manejar la lógica nutricional de una Receta.
    """
    @staticmethod
    def calcular_valores_nutricionales(receta) -> dict:
        """
        Retorna un diccionario con el cálculo de los valores nutricionales
        totales de la receta.
        (No necesitamos 'Receta' en la signatura de tipo.)
        """
        total_calorias = 0
        total_proteinas = 0
        total_carbohidratos = 0
        total_grasas = 0

        # 'receta.receta_ingredientes' ya funciona porque 'receta' es
        # una instancia de la clase Receta que se pasa desde el @property en models.py
        for receta_ingrediente in receta.receta_ingredientes.all():
            factor = UnitConversionStrategy.get_factor(
                receta_ingrediente.unidad, receta_ingrediente.cantidad
            )
            ingrediente = receta_ingrediente.ingrediente
            total_calorias += ingrediente.calorias * factor
            total_proteinas += ingrediente.proteinas * factor
            total_carbohidratos += ingrediente.carbohidratos * factor
            total_grasas += ingrediente.grasas * factor

        return {
            "calorias": total_calorias,
            "proteinas": total_proteinas,
            "carbohidratos": total_carbohidratos,
            "grasas": total_grasas,
        }


class UnitConversionStrategy:
    """
    Contiene lógica para convertir la cantidad de ingrediente
    con base en la unidad, sin modificar la clase principal.
    """

    @staticmethod
    def get_factor(unidad: str, cantidad: float) -> float:
        conversion_map = {
            'gramos':     lambda cant: cant / 100,
            'kilogramos': lambda cant: (cant * 1000) / 100,
            'mililitros': lambda cant: cant / 100,
            'litros':     lambda cant: (cant * 1000) / 100,
            'tazas':      lambda cant: cant / 1,  
            'piezas':     lambda cant: cant / 1,  
            # ...
        }
        return conversion_map.get(unidad, lambda cant: cant / 100)(cantidad)
