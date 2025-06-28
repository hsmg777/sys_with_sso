from django.urls import path
from .views import RecetasGuardadasView, RecetasMasGuardadasView

urlpatterns = [
    path('', RecetasGuardadasView.as_view(), name='recetas-guardadas'),
    path('mas-guardadas/', RecetasMasGuardadasView.as_view(), name='recetas-mas-guardadas'),
]
