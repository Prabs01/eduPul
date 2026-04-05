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
    course_title = serializers.CharField(source="course.title", read_only=True)
    program_name = serializers.CharField(source="program.name", read_only=True)

    students = serializers.SerializerMethodField()

    class Meta:
        model = CourseOffering
        fields = (
            "id",
            "course",
            "course_title",
            "semester",
            "academic_year",
            "section",
            "program",
            "program_name",
            "students",
        )

    def get_students(self, obj):
        enrollments = CourseEnrollment.objects.filter(offering=obj)

        return [
            {
                "enrollment_id": e.id,
                "student_id": e.student.id,
                "student_name": e.student.name,
                "roll_no": e.student.roll_no,
            }
            for e in enrollments
        ]

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="offering.course.title", read_only=True)
    semester = serializers.CharField(source="offering.semester", read_only=True)
    class Meta:
        model = CourseEnrollment
        fields = (
            "id",
            "offering",
            "course_name",
            "semester",
            "enrollment_date",
            "grade",
        )
        read_only_fields = ("id", "enrollment_date", "grade")

    

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
    status = serializers.ChoiceField(choices=["P", "A", "L"])


class AttendanceMarkSerializer(serializers.Serializer):
    offering = serializers.IntegerField()
    date = serializers.DateField(required = False, default= date.today)
    records = AttendanceRecordSerializer(many=True)


class CourseSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title"]


class CourseOfferingSimpleSerializer(serializers.ModelSerializer):
    course = CourseSimpleSerializer()

    class Meta:
        model = CourseOffering
        fields = ["id", "course", "semester"]


class EnrollmentSimpleSerializer(serializers.ModelSerializer):
    offering = CourseOfferingSimpleSerializer()

    class Meta:
        model = CourseEnrollment
        fields = ["id", "offering"]