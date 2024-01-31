from .serializers import MessageSerializer
from chat.models import Message
from authentication.models import CustomUser
from rest_framework import generics
from django.db.models import Subquery, Q, OuterRef

class MyChats(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        messages = Message.objects.filter(
            id__in=Subquery(
                CustomUser.objects.filter(
                    Q(sender__receiver=user_id)|
                    Q(receiver__sender=user_id)
                ).distinct().annotate(
                    last_msg=Subquery(
                        Message.objects.filter(
                            Q(sender=OuterRef('id'), receiver=user_id)|
                            Q(receiver=OuterRef('id'), sender=user_id)
                        ).order_by('-id')[:1].values_list('id', flat=True)
                    )
                ).values_list('last_msg', flat=True).order_by('-id')
            )
        ).order_by('-id')

        return messages
    
class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        messages = Message.objects.filter(
            sender__in = [sender_id, receiver_id],
            receiver__in = [sender_id, receiver_id]
        )

        return messages
    