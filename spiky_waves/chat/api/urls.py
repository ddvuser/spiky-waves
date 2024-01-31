from django.urls import path
from . import views

urlpatterns = [
    path('my-chats/<user_id>/', views.MyChats.as_view()),
]