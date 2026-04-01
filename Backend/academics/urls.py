from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, CourseViewSet, DepartmentViewSet

router = DefaultRouter()
router.register('programs', ProgramViewSet)
router.register('courses', CourseViewSet)
router.register('departments', DepartmentViewSet)

urlpatterns = router.urls

