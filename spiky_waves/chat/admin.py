from django.contrib import admin
from authentication.models import CustomUser
from chat.models import Message

class MessageAdmin(admin.ModelAdmin):
    list_editable = ['is_read']
    list_display = ['sender', 'receiver', 'is_read']

admin.site.register(CustomUser)
admin.site.register(Message, MessageAdmin)