# recetas/observers.py

class IRecetaObserver:
    """
    Interfaz base para los Observers de Receta.
    Cada observador debe implementar el método `notify(receta)`.
    """
    def notify(self, receta):
        raise NotImplementedError

class LoggerObserver(IRecetaObserver):
    """
    Observador que simplemente escribe en consola
    cuando se crea/actualiza una Receta.
    """
    def notify(self, receta):
        print(f"[LOGGER] Receta '{receta.nombre}' notificada por LoggerObserver")

class EmailObserver(IRecetaObserver):
    """
    Observador que simula el envío de un email
    al crearse o actualizarse una Receta.
    """
    def notify(self, receta):
        # Aquí podrías integrar lógica real de envío de email
        print(f"[EMAIL] Se envió un email informando la creación/actualización de '{receta.nombre}'")

class RecetaSubject:
    """
    Clase Subject que mantiene una lista de observadores.
    Cuando queremos notificar un cambio en Receta,
    llamaremos a notify_all(receta).
    """
    def __init__(self):
        self._observers = []

    def attach(self, observer: IRecetaObserver):
        self._observers.append(observer)

    def detach(self, observer: IRecetaObserver):
        self._observers.remove(observer)

    def notify_all(self, receta):
        for observer in self._observers:
            observer.notify(receta)
