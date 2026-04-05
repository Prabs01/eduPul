from datetime import date
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .serializers import DepartmentSerializer, ProgramSerializer, CourseSerializer,CourseOfferingSerializer, CourseEnrollmentSerializer, StudentSerializer, FacultySerializer, TeachingAssignmentSerializer
from . import serializers
from .models import Department,Program, Course, CourseOffering, CourseEnrollment, TeachingAssignment, Student, Faculty, Attendance
from accounts.permissions import IsAdminOrReadOnly, IsStudentOrReadOnly, IsAssignedFaculty
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q  
from django.db import transaction


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
    
    def get_queryset(self):
        user = self.request.user

        # Admin sees everything
        if user.role == "ADMIN":
            return CourseOffering.objects.all()

        # Faculty sees only assigned courses
        if user.role == "FACULTY":
            return CourseOffering.objects.filter(
                teachingassignment__faculty__user=user
            ).distinct()

        # Students (optional later)
        if user.role == "STUDENT":
            return CourseOffering.objects.filter(
                courseenrollment__student__user=user
            ).distinct()

        return CourseOffering.objects.none()

    def get_permissions(self):
        print(f"Action: {self.action}, User: {self.request.user}")
        if self.action == "retrieve":
            return [IsAssignedFaculty()]
        return [IsAdminOrReadOnly()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = CourseOfferingSerializer(instance)
        data = serializer.data

        # attach attendance summary
        data["attendance_summary"] = self.get_attendance_summary(instance)

        return Response(data)

    def get_attendance_summary(self, offering):
        enrollments = CourseEnrollment.objects.filter(offering=offering)

        result = []

        for e in enrollments:
            records = Attendance.objects.filter(enrollment=e)

            present = records.filter(status="P").count()
            absent = records.filter(status="A").count()
            late = records.filter(status="L").count()
            total = records.count()

            result.append({
                "student_name": e.student.name,
                "present": present,
                "absent": absent,
                "late": late,
                "percentage": round((present / total) * 100, 2) if total else 0
            })

        return result


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
        
        if hasattr(user, "student"):
            student = user.student
        else:
            raise PermissionDenied("Student profile not found.")
        
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
        if self.action == "mark":
            return serializers.AttendanceMarkSerializer
        else:
            return serializers.AttendanceSerializer

    @action(detail=False, methods=["post"])
    def mark(self, request):
        serializer = serializers.AttendanceMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if user.role != "FACULTY":
            raise PermissionDenied("Only faculty can mark attendance.")

        offering_id = serializer.validated_data["offering"]
        date = serializer.validated_data["date"]
        records = serializer.validated_data["records"]

        # check faculty owns course
        if not TeachingAssignment.objects.filter(
            faculty=user.faculty,
            offering_id=offering_id
        ).exists():
            raise PermissionDenied("Not assigned to this course.")

        # prevent duplicate marking
        if Attendance.objects.filter(
            enrollment__offering_id=offering_id,
            date=date
        ).exists():
            raise PermissionDenied("Attendance already marked for this date.")
        

        with transaction.atomic():
            for record in records:

                enrollment_exists = CourseEnrollment.objects.filter(
                    id=record["enrollment"],
                    offering_id=offering_id
                ).exists()

                if not enrollment_exists:
                    raise PermissionDenied("Invalid enrollment for this course.")

                Attendance.objects.create(
                    enrollment_id=record["enrollment"],
                    date=date,
                    status=record["status"]
                )

        return Response({"message": "Attendance marked successfully"})
    
    @action(detail=False, methods=["put"])
    def edit(self, request):
        serializer = serializers.AttendanceMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if user.role != "FACULTY":
            raise PermissionDenied("Only faculty can edit attendance.")

        offering_id = serializer.validated_data["offering"]
        date = serializer.validated_data["date"]
        records = serializer.validated_data["records"]

        # check faculty owns course
        if not TeachingAssignment.objects.filter(
            faculty=user.faculty,
            offering_id=offering_id
        ).exists():
            raise PermissionDenied("Not assigned to this course.")

        with transaction.atomic():
            for record in records:
                Attendance.objects.update_or_create(
                    enrollment_id=record["enrollment"],
                    date=date,
                    defaults={
                        "status": record["status"]
                    }
                )

        return Response({"message": "Attendance updated successfully"})

    def get_queryset(self):
        user = self.request.user

        if user.role == "FACULTY" and hasattr(user, "faculty"):
            return Attendance.objects.filter(enrollment__offering__teachingassignment__faculty=user.faculty)
        
        elif user.role == "STUDENT" and hasattr(user, "student"):
            return Attendance.objects.filter(enrollment__student=user.student)
        
        else:
            return Attendance.objects.all()
        
    @action(detail=False, methods=["get"])
    def by_date(self, request):
        offering_id = request.query_params.get("offering")
        date = request.query_params.get("date")

        records = Attendance.objects.filter(
            enrollment__offering_id=offering_id,
            date=date
        ).select_related("enrollment__student")

        data = [
            {
                "student_id": r.enrollment.student.id,
                "student_name": r.enrollment.student.name,
                "roll_no": r.enrollment.student.roll_no,
                "status": r.status,
            }
            for r in records
        ]

        return Response(data)
    
    @action(detail=False, methods=["get"])
    def dates(self, request):
        offering_id = request.query_params.get("offering")

        records = Attendance.objects.filter(
            enrollment__offering_id=offering_id
        ).values("date").distinct()

        dates = [r["date"] for r in records]

        return Response(dates)
            
    @action(detail=False, methods=["get"])
    def summary(self, request):
        queryset = self.get_queryset()

        if request.user.role == "STUDENT":
            summary = queryset.values(
            "enrollment__offering",
            "enrollment__offering__course__title"
            ).annotate(
                total=Count("id"),
                present=Count("id", filter=Q(status="P")),
                late=Count("id", filter=Q(status="L")),
                absent=Count("id", filter=Q(status="A"))
            )

            result = []

            for item in summary:
                total = item["total"]
                present = item["present"]

                late = item["late"]
                absent = item["absent"]

                effective_present = present + late

                percentage = (effective_present / total) * 100 if total > 0 else 0

                result.append({
                    "offering": item["enrollment__offering"],
                    "course_title": item["enrollment__offering__course__title"],
                    "present":present,
                    "late": late,
                    "absent": absent,
                    "total":total,
                    "percentage": round(percentage, 2)
                })

            return Response(result)

        elif request.user.role == "FACULTY":
            summary = queryset.values(
                "enrollment__student",
                "enrollment__student__user__username",
                "enrollment__offering",
                "enrollment__offering__course__title"
            ).annotate(
                total=Count("id"),
                present=Count("id", filter=Q(status="P")),
                late=Count("id", filter=Q(status="L")),
                absent=Count("id", filter=Q(status="A"))
            )

            result = []

            for item in summary:
                student = item["enrollment__student"]
                student_name = item["enrollment__student__user__username"]
                offering = item["enrollment__offering"]
                course = item["enrollment__offering__course__title"]

                total = item["total"]
                present = item["present"]
                late = item["late"]
                absent = item["absent"]

                effective_present = present + late

                percentage = (effective_present / total) * 100 if total > 0 else 0

                result.append({
                    "student": student,
                    "student_name": student_name,
                    "offering": offering,
                    "course": course,
                    "present": present,
                    "late": late,
                    "absent": absent,
                    "total": total,
                    "percentage": round(percentage, 2)
                })

            return Response(result)

        
class StudentDashboardAPIView(APIView):
    permmission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "STUDENT":
            raise PermissionDenied("Only students can access the dashboard.")
        
        student = user.student

        enrollments = CourseEnrollment.objects.filter(student=student)

        courses = [
            {
                "offering_id": e.offering.id,
                "course_title": e.offering.course.title,
            }
            for e in enrollments
        ]

        attendance_qs = Attendance.objects.filter(enrollment__student=student).values(
            "enrollment__offering",
            "enrollment__offering__course__title"
        ).annotate(
            total=Count("id"),
            present=Count("id", filter=Q(status="P")),
            late=Count("id", filter=Q(status="L")),
            absent=Count("id", filter=Q(status="A"))
        )

        attendance_summary = []

        for item in attendance_qs:
            total = item["total"]
            present = item["present"]
            late = item["late"]
            absent = item["absent"]

            effective_present = present + late

            percentage = (effective_present / total) * 100 if total > 0 else 0

            attendance_summary.append({
                "offering": item["enrollment__offering"],
                "course_title": item["enrollment__offering__course__title"],
                "present": present,
                "late": late,
                "absent": absent,
                "total": total,
                "percentage": round(percentage, 2)
            })

        warnings = []

        for item in attendance_summary:
            if item["percentage"] < 75:
                warnings.append(f"Attendance for {item['course_title']} is below 75% ({item['percentage']}%).")

        return Response({
            "student": {
                "id": student.id,
                "name": student.user.username,
                "program": student.program.name
            },
            "enrolled_courses": courses,
            "attendance_summary": attendance_summary,
            "warnings": warnings
        })


class FacultyDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user

        if user.role != "FACULTY":
            raise PermissionDenied("Only faculty can access the dashboard.")
        
        faculty = user.faculty

        assignments = TeachingAssignment.objects.filter(faculty=faculty)
        offering_ids = assignments.values_list("offering_id", flat=True)

        total_courses = assignments.count()

        total_students = CourseEnrollment.objects.filter(
            offering_id__in=offering_ids
        ).values("student").distinct().count()

        course_data = []

        for offering_id in offering_ids:
            enrollments = CourseEnrollment.objects.filter(offering_id=offering_id)

            attendance_qs = Attendance.objects.filter(
                enrollment__offering_id=offering_id
            )

            total = attendance_qs.count()

            present = attendance_qs.filter(status="P").count()
            late = attendance_qs.filter(status="L").count()

            avg_attendance = ((present + late) / total * 100) if total else 0

            course_data.append({
                "offering_id": offering_id,
                "total_students": enrollments.count(),
                "avg_attendance": round(avg_attendance, 2)
            })

            at_risk_students = []

            students = CourseEnrollment.objects.filter(
                offering_id__in=offering_ids
            ).values_list("student", flat=True).distinct()

            for student_id in students:
                attendance_qs = Attendance.objects.filter(
                    enrollment__student_id=student_id,
                    enrollment__offering_id__in=offering_ids
                )

                total = attendance_qs.count()
                present = attendance_qs.filter(status="P").count()
                late = attendance_qs.filter(status="L").count()

                percentage = ((present + late) / total * 100) if total else 0

                if percentage < 75:
                    student = Student.objects.get(id=student_id)

                    at_risk_students.append({
                        "student": student.user.username,
                        "attendance": round(percentage, 2)
                    })

            return Response({
                "faculty": {
                    "id": faculty.id,
                    "name": faculty.user.username
                },
                "teaching_overview": {
                    "total_courses": total_courses,
                    "total_students": total_students,
                },
                "courses": course_data,
                "at_risk_students": at_risk_students,
            })
        
