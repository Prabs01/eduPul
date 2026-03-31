from django.urls import path
from .views import RegisterView, MeView, CustomTokenObtainPairView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
]