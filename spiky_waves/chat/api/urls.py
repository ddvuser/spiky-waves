from django.urls import path
from . import views

urlpatterns = [
    path("my-messages/<user_id>/", views.MyMessages.as_view()),
    path("get-messages/<sender_id>/<receiver_id>/", views.GetMessages.as_view()),
    path("send-messages/", views.SendMessage.as_view()),
    path("profile/<int:pk>/", views.ProfileDetail.as_view()),
    path("search-user/<str:username>/", views.SearchUser.as_view()),
    path("get-email-change-code/<int:pk>/", views.UserEdit.as_view()),
    path("get-user-account/<int:pk>/", views.UserAccount.as_view()),
    path(
        "mark-messages-as-read/<int:user_id>/<int:participant_id>/",
        views.MarkMessagesAsRead.as_view(),
    ),
]
