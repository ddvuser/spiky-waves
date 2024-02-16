from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create-user/', views.UserCreateView.as_view(), name='create-user'),
    path('change-password/<int:pk>/', views.ChangePassword.as_view(), name='change-password'),
]