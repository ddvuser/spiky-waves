from django.contrib import admin
from .models import EmailChangeCode

class EmailChangeCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'code', 'created']

admin.site.register(EmailChangeCode, EmailChangeCodeAdmin)