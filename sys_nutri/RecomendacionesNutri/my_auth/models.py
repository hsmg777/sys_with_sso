from django.db.models import JSONField
from django.db import models
from django.contrib.auth.models import AbstractUser
from preferencias.models import PreferenciaAlimentaria  # Importar desde la app preferencias


class Usuario(AbstractUser):
    email = models.EmailField()
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    altura = models.FloatField(null=True, blank=True)  # En metros
    peso = models.FloatField(null=True, blank=True)    # En kilogramos
    imc = models.FloatField(null=True, blank=True)     # IMC almacenado en la base de datos
    macronutrientes = JSONField(null=True, blank=True) # Macronutrientes recomendados
    preferencias_alimentarias = models.ManyToManyField(PreferenciaAlimentaria, blank=True)

    first_name = None
    last_name = None

    def __str__(self):
        return self.email

    def calcular_imc(self):
        if self.altura and self.peso:
            return round(self.peso / (self.altura ** 2), 2)
        return None

    def calcular_macronutrientes(self):
        if self.peso:
            return {
                "proteinas": round(self.peso * 1.8, 1),
                "carbohidratos": round(self.peso * 4, 1),
                "grasas": round(self.peso * 0.8, 1),
            }
        return None

    def get_minimos(self):
        """
        Calcula los valores mínimos de macronutrientes basados en el 70% de las necesidades.
        """
        if self.macronutrientes:
            return {
                "proteinas": round(self.macronutrientes["proteinas"] * 0.7, 1),
                "carbohidratos": round(self.macronutrientes["carbohidratos"] * 0.7, 1),
                "grasas": round(self.macronutrientes["grasas"] * 0.7, 1),
                "calorias": round(
                    (self.macronutrientes["proteinas"] * 0.7 * 4) +
                    (self.macronutrientes["carbohidratos"] * 0.7 * 4) +
                    (self.macronutrientes["grasas"] * 0.7 * 9), 1
                ),
            }
        return None

    def get_maximos(self):
        """
        Calcula los valores máximos de macronutrientes basados en el 120% de carbohidratos
        y los valores originales para proteínas y grasas.
        """
        if self.macronutrientes:
            return {
                "proteinas": self.macronutrientes["proteinas"],
                "carbohidratos": round(self.macronutrientes["carbohidratos"] * 1.2, 1),
                "grasas": self.macronutrientes["grasas"],
                "calorias": round(
                    (self.macronutrientes["proteinas"] * 4) +
                    (self.macronutrientes["carbohidratos"] * 1.2 * 4) +
                    (self.macronutrientes["grasas"] * 9), 1
                ),
            }
        return None
    
    def recalcular_macronutrientes(self):
        """
        Recalcula los macronutrientes y los almacena en el campo correspondiente.
        """
        if self.peso and self.peso > 0:
            self.macronutrientes = {
                "proteinas": round(self.peso * 1.8, 1),
                "carbohidratos": round(self.peso * 4, 1),
                "grasas": round(self.peso * 0.8, 1),
            }
        else:
            self.macronutrientes = None

        self.save(update_fields=["macronutrientes"])
