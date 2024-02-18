from chat.models import Profile, Message
from authentication.models import CustomUser
from rest_framework import serializers

import chat.utils as cg
from authentication.models import EmailChangeCode
from datetime import timedelta
from django.utils import timezone
from rest_framework.exceptions import ValidationError


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "username"]


class UserAccountEditSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    verification_code = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ["email", "username", "verification_code"]

    def update(self, instance, validated_data):
        email = validated_data.get("email")
        username = validated_data.get("username")
        verification_code = validated_data.get("verification_code")

        if email:
            if instance.email != email:
                # Check if the new email is already used by another user
                if (
                    CustomUser.objects.filter(email=email)
                    .exclude(pk=instance.pk)
                    .exists()
                ):
                    raise ValidationError({"detail": "Email already exists"})

                try:
                    # Retrieve the EmailChangeCode instance for the user
                    email_change_code = EmailChangeCode.objects.get(user=instance)

                    # Check if the verification code matches
                    if verification_code == email_change_code.code:
                        # Update the user's email
                        instance.email = email
                        instance.save()
                        return instance
                    else:
                        raise ValidationError({"detail": "Invalid verification code"})
                except EmailChangeCode.DoesNotExist:
                    raise ValidationError({"detail": "Verification code not found"})
            else:
                raise ValidationError(
                    {"detail": "New email is the same as the current email"}
                )

        if username:
            instance.username = username
            instance.save()

        return instance

    def to_representation(self, instance):
        # Check if EmailChangeCode object exists for the user
        try:
            email_change_code = EmailChangeCode.objects.get(user=instance)
            # Check if the creation time is within 5 minutes from the current time
            if email_change_code.created > timezone.now() - timedelta(minutes=5):
                return super().to_representation(instance)
            else:
                # EmailChangeCode object exists but expired, create a new one
                email_change_code.delete()
                # Generate code
                v_code = cg.generate_verification_code()
                EmailChangeCode.objects.create(user=instance, code=v_code)
                cg.send_verification_email(instance, v_code)

        except EmailChangeCode.DoesNotExist:
            # EmailChangeCode object does not exist, create a new one
            EmailChangeCode.objects.create(
                user=instance, code=cg.generate_verification_code()
            )
            v_code = cg.generate_verification_code()
            cg.send_verification_email(instance, v_code)

        return super().to_representation(instance)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "name", "surname"]


class ProfileSerializer(serializers.ModelSerializer):
    # Exclude unnecessary fields
    user = CustomUserSerializer()

    class Meta:
        model = Profile
        fields = ["id", "user", "bio", "image", "full_name"]


class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)
    unread_count = serializers.IntegerField(read_only=True)

    # Exclude unnecessary fields
    sender = CustomUserSerializer()
    receiver = CustomUserSerializer()

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "receiver",
            "sender_profile",
            "receiver_profile",
            "text",
            "created",
            "updated",
            "is_read",
            "unread_count",
        ]

    def __init__(self, *args, **kwargs):
        super(MessageSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 2
