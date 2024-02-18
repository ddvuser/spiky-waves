from .serializers import (
    MessageSerializer,
    ProfileSerializer,
    UserAccountEditSerializer,
    UserAccountSerializer,
    SendMessageSerializer,
)
from chat.models import Message, Profile
from authentication.models import CustomUser
from rest_framework import generics
from django.db.models import Subquery, Q, OuterRef
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class MyMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        messages = Message.objects.filter(
            id__in=Subquery(
                CustomUser.objects.filter(
                    Q(sender__receiver=user_id) | Q(receiver__sender=user_id)
                )
                .distinct()
                .annotate(
                    last_msg=Subquery(
                        Message.objects.filter(
                            Q(sender=OuterRef("id"), receiver=user_id)
                            | Q(receiver=OuterRef("id"), sender=user_id)
                        )
                        .order_by("-id")[:1]
                        .values_list("id", flat=True)
                    )
                )
                .values_list("last_msg", flat=True)
                .order_by("-id")
            )
        ).order_by("-id")

        # Iterate over each message and compute the count of unread messages
        for message in messages:
            # Compute the count of unread messages for the sender-receiver pair
            sender_lookup = self.request.user
            if message.sender == self.request.user:
                sender_lookup = message.receiver
            else:
                sender_lookup = message.sender

            unread_count = Message.objects.filter(
                sender=sender_lookup, receiver=self.request.user, is_read=False
            ).count()

            # Add the unread_count as a new field in the message object
            message.unread_count = unread_count

        return messages


class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sender_id = self.kwargs["sender_id"]
        receiver_id = self.kwargs["receiver_id"]

        messages = Message.objects.filter(
            sender__in=[sender_id, receiver_id], receiver__in=[sender_id, receiver_id]
        )

        return messages


class SendMessage(generics.CreateAPIView):
    serializer_class = SendMessageSerializer
    permission_classes = [IsAuthenticated]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()


class SearchUser(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()

    def list(self, request, *args, **kwargs):
        username = self.kwargs["username"]
        logged_in_user = self.request.user
        users = Profile.objects.filter(
            Q(user__username__icontains=username)
            | Q(user__email__icontains=username) & ~Q(user=logged_in_user)
        )
        if not users.exists():
            return Response(
                {"detail": "No users found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)


class UserEdit(generics.RetrieveUpdateAPIView):
    serializer_class = UserAccountEditSerializer
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()


class UserAccount(generics.RetrieveAPIView):
    serializer_class = UserAccountSerializer
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()


class MarkMessagesAsRead(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, participant_id):
        # Assuming you pass message_ids as a list in the request body
        message_ids = request.data

        try:
            # Update the is_read field of messages with the given IDs
            messages = Message.objects.filter(
                id__in=message_ids, sender_id=participant_id, receiver_id=user_id
            )
            messages.update(is_read=True)

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
