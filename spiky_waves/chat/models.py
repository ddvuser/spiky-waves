from django.db import models
from authentication.models import CustomUser

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="uploads/profile_images/", default='default_profile_pic.png')
    verified = models.BooleanField(default=False)

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    text = models.CharField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created']
    
    def __str__(self) -> str:
        return f"{self.sender} to {self.receiver}"
    