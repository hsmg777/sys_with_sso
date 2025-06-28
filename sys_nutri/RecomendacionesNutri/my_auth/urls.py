from django.urls import path
from .views import RegistroUsuarioView, LoginView, UserProfileView, MisMacronutrientesView

urlpatterns = [
    path('register/', RegistroUsuarioView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('mis-macronutrientes/', MisMacronutrientesView.as_view(), name='mis-macronutrientes'),
]
