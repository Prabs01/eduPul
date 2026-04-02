from datetime import date
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import DepartmentSerializer, ProgramSerializer, CourseSerializer,CourseOfferingSerializer, CourseEnrollmentSerializer, StudentSerializer, FacultySerializer, TeachingAssignmentSerializer
from . import serializers
from .models import Department,Program, Course, CourseOffering, CourseEnrollment, TeachingAssignment, Student, Faculty, Attendance
from accounts.permissions import IsAdminOrReadOnly, IsStudentOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


# Create your views here.

class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]


class ProgramViewSet(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdminOrReadOnly]
    
class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]


class CourseOfferingViewSet(ModelViewSet):
    queryset = CourseOffering.objects.all()
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAdminOrReadOnly]


class CourseEnrollmentViewSet(ModelViewSet):
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "STUDENT":
            return CourseEnrollment.objects.filter(student=user.student)  # Students can only see their own enrollments

        else:
            return CourseEnrollment.objects.all()
        
    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "STUDENT":
            raise PermissionDenied("Only students can enroll in courses.") #Only Student can enroll in courses
        
        student = user.student
        offering = serializer.validated_data["offering"]

        if student.program != offering.program:
            raise PermissionDenied("You can only enroll in courses offered for your program.")
        
        if CourseEnrollment.objects.filter(student=student, offering=offering).exists():
            raise PermissionDenied("You are already enrolled in this course offering.") # Prevent duplicate enrollments
        
        serializer.save(
            student=student,
            enrollment_date=date.today()
        )


    
class StudentView(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrReadOnly]

class FacultyView(ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsAdminOrReadOnly]


class TeachingAssignmentViewSet(ModelViewSet):
    queryset = TeachingAssignment.objects.all()
    serializer_class = TeachingAssignmentSerializer
    permission_classes = [IsAdminOrReadOnly]

class AttendanceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.AttendanceBulkSerializer
        else:
            return serializers.AttendanceSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "FACULTY":
            raise PermissionDenied("Only faculty can record attendance.")
        

        records = self.request.data.get("records", [])
        date = serializer.validated_data.get("date")
        offering = self.request.data.get("offering")

        if not TeachingAssignment.objects.filter(faculty=user.faculty, offering=offering).exists():
            raise PermissionDenied("You can only record attendance for courses you are teaching.")
        
        if Attendance.objects.filter(enrollment__offering_id=offering, date=date).exists():
            raise PermissionDenied("Attendance already marked for this date.")
        
        for record in records:
            Attendance.objects.create(
                enrollment_id=record["enrollment"],
                date=date,
                status=record["status"]
            )

    def get_queryset(self):
        user = self.request.user

        if user.role == "FACULTY" and hasattr(user, "faculty"):
            return Attendance.objects.filter(enrollment__offering__teachingassignment__faculty=user.faculty)
        
        elif user.role == "STUDENT" and hasattr(user, "student"):
            return Attendance.objects.filter(enrollment__student=user.student)
        
        else:
            return Attendance.objects.all()