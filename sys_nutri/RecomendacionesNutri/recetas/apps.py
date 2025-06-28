from django.apps import AppConfig

class RecetasConfig(AppConfig):
    name = 'recetas'

    def ready(self):
        # Importamos el módulo de signals para que Django los reconozca
        import recetas.signals