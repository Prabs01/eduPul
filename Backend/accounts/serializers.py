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


        # attach user dynamically
        user = None

        if self.user.role == "STUDENT":
            try:
                s = Student.objects.get(user=self.user)
                user = {
                    "id": s.id,
                    "roll_no": s.roll_no,
                    "name": s.name,
                    "email": s.email,
                    "role": "STUDENT",
                }
            except Student.DoesNotExist:
                user = None

        elif user == "FACULTY":
            try:
                f = Faculty.objects.get(user=self.user)
                user = {
                    "id": f.id,
                    "name": f.name,
                    "email": f.email,
                    "role": "FACULTY",
                }
            except Faculty.DoesNotExist:
                user = None

        data["user"] = user

        return data
    

