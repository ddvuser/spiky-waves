from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from authentication.models import CustomUser
from rest_framework import status
from .serializers import UserSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from chat.models import Profile

class UserCreateView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        password = serializer.validated_data['password']
        user = serializer.save()
        user.set_password(password)
        user.save()   

        # Obtain tokens for the new user
        token_serializer = MyTokenObtainPairSerializer(data={'email': user.email, 'password': password})
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data

        # Create profile for a user
        full_name = ''
        if user.name == '' or user.surname == '':
            full_name = user.username

        full_name = user.name + " " + user.surname

        Profile.objects.create(
            user=user,
            full_name = full_name,
            bio = '',
            verified = False
        )

        return Response(tokens, status=status.HTTP_201_CREATED)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def put(self, request, pk):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            current_password = serializer.validated_data.get('current_password')
            new_password = serializer.validated_data.get('new_password')

            user = request.user
            # Check if the current password matches
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=400)

            # Set the new password
            user.set_password(new_password)
            user.save()
            
            return Response({'success': 'Password changed successfully'}, status=200)
        else:
            return Response(serializer.errors, status=400)
