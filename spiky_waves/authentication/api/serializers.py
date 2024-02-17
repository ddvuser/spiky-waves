from rest_framework import serializers
from authentication.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "username", "name", "surname", "phone", "password"]


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        current_password = data.get("current_password")
        new_password = data.get("new_password")
        confirm_new_password = data.get("confirm_new_password")

        # Check if new password matches the confirmation
        if new_password != confirm_new_password:
            raise serializers.ValidationError(
                "New password and confirmation do not match"
            )

        return data


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.RegexField(
        regex=r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        write_only=True,
        error_messages={
            "invalid": (
                "Password must be at least 8 characters long with at least one capital letter and symbol"
            )
        },
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
