from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from academics.models import Student, Faculty


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"]
        )
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data['role'] = user.role

        # attach profile dynamically
        profile = None

        if user.role == "STUDENT":
            try:
                s = Student.objects.get(user=user)
                profile = {
                    "id": s.id,
                    "roll_no": s.roll_no,
                    "name": s.name,
                }
            except Student.DoesNotExist:
                profile = None

        elif user.role == "FACULTY":
            try:
                f = Faculty.objects.get(user=user)
                profile = {
                    "id": f.id,
                    "name": f.name,
                    "email": f.email,
                }
            except Faculty.DoesNotExist:
                profile = None

        data["profile"] = profile

        return data
    

