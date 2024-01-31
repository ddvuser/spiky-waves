from django.urls import path
from . import views

urlpatterns = [
    path('my-chats/<user_id>/', views.MyChats.as_view()),
    path('get-chats/<sender_id>/<receiver_id>', views.GetMessages.as_view()),
]