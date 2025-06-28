from django.urls import path
from .views import RecetaIngredienteListCreateView

urlpatterns = [
    path('', RecetaIngredienteListCreateView.as_view(), name='receta-ingrediente-list-create'),
]
