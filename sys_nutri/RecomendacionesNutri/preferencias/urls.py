from django.urls import path
from .views import PreferenciaAlimentariaList

urlpatterns = [
    path('', PreferenciaAlimentariaList.as_view(), name='preferencias-list'),
]
