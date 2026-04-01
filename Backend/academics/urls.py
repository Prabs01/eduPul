from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, CourseViewSet, DepartmentViewSet, CourseOfferingViewSet

router = DefaultRouter()
router.register('programs', ProgramViewSet)
router.register('courses', CourseViewSet)
router.register('departments', DepartmentViewSet)
router.register('course-offerings', CourseOfferingViewSet)

urlpatterns = router.urls

