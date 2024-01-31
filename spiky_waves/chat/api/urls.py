from django.urls import path
from . import views

urlpatterns = [
    path('my-messages/<user_id>/', views.MyMessages.as_view()),
    path('get-messages/<sender_id>/<receiver_id>', views.GetMessages.as_view()),
    path('send-messages/', views.SendMessage.as_view()),
]