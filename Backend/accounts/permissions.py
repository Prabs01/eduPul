from rest_framework.permissions import BasePermission, SAFE_METHODS
from academics.models import TeachingAssignment

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        
        # Only admin can modify
        return (
            request.user.is_authenticated and 
            request.user.role == "ADMIN"
        )
    
class IsStudentOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        
        # Only students can modify
        return (
            request.user.is_authenticated and 
            request.user.role == "STUDENT"
        )
    

class IsAssignedFaculty(BasePermission):

    def has_permission(self, request,view):
        # runs BEFORE object is fetched
        return request.user.is_authenticated and request.user.role in ["ADMIN", "FACULTY"]


    def has_object_permission(self, request, view, obj):
        user = request.user

        # allow admin always
        if user.role == "ADMIN":
            return True

        # only faculty can pass
        if not hasattr(user, "faculty"):
            return False
        
        print(f"Checking if {user.faculty} is assigned to {obj}...")

        return TeachingAssignment.objects.filter(
            faculty=user.faculty,
            offering=obj
        ).exists()