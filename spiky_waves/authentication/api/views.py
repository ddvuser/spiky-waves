from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.views import APIView
from authentication.models import CustomUser
from rest_framework import status
from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
    ResetPasswordRequestSerializer,
    ResetPasswordSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from chat.models import Profile
from authentication.models import PasswordReset
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from chat.utils import send_reset_pass_link


class UserCreateView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        password = serializer.validated_data["password"]
        user = serializer.save()
        user.set_password(password)
        user.save()

        # Obtain tokens for the new user
        token_serializer = MyTokenObtainPairSerializer(
            data={"email": user.email, "password": password}
        )
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data

        # Create profile for a user
        full_name = ""
        if user.name == "" or user.surname == "":
            full_name = user.username

        full_name = user.name + " " + user.surname

        Profile.objects.create(user=user, full_name=full_name, bio="", verified=False)

        return Response(tokens, status=status.HTTP_201_CREATED)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def put(self, request, pk):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            current_password = serializer.validated_data.get("current_password")
            new_password = serializer.validated_data.get("new_password")

            user = request.user
            # Check if the current password matches
            if not user.check_password(current_password):
                return Response({"error": "Current password is incorrect"}, status=400)

            # Set the new password
            user.set_password(new_password)
            user.save()

            return Response({"success": "Password changed successfully"}, status=200)
        else:
            return Response(serializer.errors, status=400)


class RequestPasswordReset(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data["email"]
        user = CustomUser.objects.filter(email__iexact=email).first()

        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            reset = PasswordReset(email=email, token=token)
            reset.save()

            reset_url = f"http://127.0.0.1:3000/confirm-pass-reset/{token}"

            # Sending reset link via email
            send_reset_pass_link(user, reset_url)

            return Response(
                {"success": "We have sent you a link to reset your password"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "User with credentials not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class ResetPassword(GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, token):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        new_password = data["new_password"]
        confirm_password = data["confirm_password"]

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        reset_obj = PasswordReset.objects.filter(token=token).first()

        if not reset_obj:
            return Response({"error": "Invalid token"}, status=400)

        user = CustomUser.objects.filter(email=reset_obj.email).first()

        if user:
            user.set_password(request.data["new_password"])
            user.save()

            reset_obj.delete()

            return Response({"success": "Password updated"})
        else:
            return Response({"error": "No user found"}, status=404)
