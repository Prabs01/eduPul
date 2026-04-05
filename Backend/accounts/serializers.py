from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from academics.models import Student, Faculty, TeachingAssignment, CourseEnrollment
from academics.serializers import EnrollmentSimpleSerializer


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

        user_data = None

        # 🔹 STUDENT
        if self.user.role == "STUDENT":
            try:
                student = Student.objects.select_related("program").get(user=self.user)

                enrollments = CourseEnrollment.objects.filter(
                    student=student
                ).select_related("offering__course")

                user_data = {
                    "id": student.id,
                    "name": student.name,
                    "email": student.email,
                    "role": "STUDENT",
                    "program": student.program.name if student.program else None,
                    "enrollments": EnrollmentSimpleSerializer(enrollments, many=True).data
                }

            except Student.DoesNotExist:
                user_data = None

        # 🔹 FACULTY
        elif self.user.role == "FACULTY":
            try:
                faculty = Faculty.objects.get(user=self.user)

                assignments = TeachingAssignment.objects.filter(
                    faculty=faculty
                ).select_related("offering__course")

                user_data = {
                    "id": faculty.id,
                    "name": faculty.name,
                    "email": faculty.email,
                    "role": "FACULTY",
                    "assignments": [
                        {
                            "course": a.offering.course.title,
                            "semester": a.offering.semester
                        }
                        for a in assignments
                    ]
                }

            except Faculty.DoesNotExist:
                user_data = None

        data["user"] = user_data
        return data