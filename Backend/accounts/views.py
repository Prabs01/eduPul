from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from .models import User
from academics.models import Student, Faculty, TeachingAssignment, CourseEnrollment
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("REGISTER ERROR:", serializer.errors)  # 🔥 IMPORTANT DEBUG
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        data = {
            "id": user.id,
            "username": user.username,
            "role": user.role,
        }

        # 🔹 STUDENT
        if user.role == "STUDENT":
            try:
                student = Student.objects.select_related("program").get(user=user)

                enrollments = CourseEnrollment.objects.filter(
                    student=student
                ).select_related("offering__course")

                data["student"] = {
                    "name": student.name,
                    "email": student.email,
                    "program": student.program.name if student.program else None,
                    "enrollments": [
                        {
                            "id": e.id,
                            "course": e.offering.course.title,
                            "semester": e.offering.semester,
                        }
                        for e in enrollments
                    ]
                }

            except Student.DoesNotExist:
                data["student"] = None

        # 🔹 FACULTY
        elif user.role == "FACULTY":
            try:
                faculty = Faculty.objects.get(user=user)

                assignments = TeachingAssignment.objects.filter(
                    faculty=faculty
                ).select_related("offering__course")

                data["faculty"] = {
                    "name": faculty.name,
                    "email": faculty.email,
                    "assignments": [
                        {
                            "id": a.id,
                            "course": a.offering.course.title,
                            "semester": a.offering.semester,
                        }
                        for a in assignments
                    ]
                }

            except Faculty.DoesNotExist:
                data["faculty"] = None

        return Response(data)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
