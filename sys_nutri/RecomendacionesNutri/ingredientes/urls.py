from django.urls import path
from .views import IngredienteListCreateView, IngredienteDetailView

urlpatterns = [
    path('', IngredienteListCreateView.as_view(), name='ingredientes-list-create'),
    path('<int:pk>/', IngredienteDetailView.as_view(), name='ingrediente-detail'),
]
