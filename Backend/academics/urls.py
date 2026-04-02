from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, CourseViewSet, DepartmentViewSet, CourseOfferingViewSet

router = DefaultRouter()
router.register('programs', ProgramViewSet)
router.register('courses', CourseViewSet)
router.register('departments', DepartmentViewSet)
router.register('course-offerings', CourseOfferingViewSet)
router.register('course-enrollments', views.CourseEnrollmentViewSet, basename = "course-enrollments")
router.register('students', views.StudentView, basename = "students")
router.register('faculties', views.FacultyView, basename = "faculties")
router.register('teaching-assignments', views.TeachingAssignmentViewSet, basename = "teaching-assignments")
router.register('attendances', views.AttendanceViewSet, basename = "attendances")

urlpatterns = router.urls + [
    path('student/dashboard/', views.StudentDashboardAPIView.as_view(), name='student-dashboard'),
    path('faculty/dashboard/', views.FacultyDashboardAPIView.as_view(), name='faculty-dashboard'),
]

