from rest_framework import serializers
from .models import Student, Faculty, Course,CourseOffering, CourseEnrollment,Department,Program, Attendance, TeachingAssignment
from datetime import date


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class CourseOfferingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOffering
        fields = ("course", "semester", "academic_year", "section", "program")


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = ("id","offering", "enrollment_date", "grade")  # Only expose these fields, Student is determined by the authenticated user
        read_only_fields = ("id","enrollment_date", "grade")

    

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("id", "roll_no", "name","email" ,"program")
        read_only_fields = ("id",)  


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ("id", "name", "email", "department")
        read_only_fields = ("id",)

class TeachingAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachingAssignment
        fields = ("id", "faculty", "offering", "role")
        read_only_fields = ("id",)
    

class AttendanceSerializer(serializers.ModelSerializer):
    offering = serializers.CharField(source="enrollment.offering.id")
    class Meta:
        model = Attendance
        fields = ("id", "enrollment", "offering" ,"date", "status")
        read_only_fields = ("id",)


class AttendanceRecordSerializer(serializers.Serializer):
    enrollment = serializers.IntegerField()
    status = serializers.CharField()


class AttendanceBulkSerializer(serializers.Serializer):
    offering = serializers.IntegerField()
    date = serializers.DateField(required = False, default= date.today)
    records = AttendanceRecordSerializer(many=True)