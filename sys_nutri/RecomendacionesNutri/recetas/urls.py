from django.urls import path
from .views import RecetaListCreateView, RecetaDetailView, RecomendacionRecetasView, RecomendacionNutricionalView

urlpatterns = [
    path('', RecetaListCreateView.as_view(), name='recetas-list-create'),
    path('<int:pk>/', RecetaDetailView.as_view(), name='recetas-detail'),
    path('recomendaciones/', RecomendacionRecetasView.as_view(), name='recomendaciones-recetas'),
    path('recomendaciones-nutricionales/', RecomendacionNutricionalView.as_view(), name='recomendaciones-nutricionales'),
]
