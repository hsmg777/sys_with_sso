# recetas/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Receta
from .observers import RecetaSubject, LoggerObserver, EmailObserver

# Creamos una instancia del Subject
subject = RecetaSubject()

# Adjuntamos algunos observers concretos
subject.attach(LoggerObserver())
subject.attach(EmailObserver())

@receiver(post_save, sender=Receta)
def receta_post_save_handler(sender, instance, created, **kwargs):
    """
    Signal que se dispara justo después de guardar (crear o actualizar)
    una instancia de Receta en la base de datos.
    """
    # Aquí es donde invocamos el método para notificar a todos los Observers
    subject.notify_all(instance)

    if created:
        print(f"[SIGNAL] Se ha creado la receta '{instance.nombre}'")
    else:
        print(f"[SIGNAL] La receta '{instance.nombre}' ha sido actualizada")
