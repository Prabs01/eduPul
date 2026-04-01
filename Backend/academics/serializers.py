from rest_framework import serializers
from .models import Student, Faculty, Course, CourseEnrollment,Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

    def create(self, validated_data):
        return Department.objects.create(
            name = validated_data["name"]
        )

    def list(self, validated_data):
        return Department.objects.all()
    
    def remove(self, validated_data):
        department = self.get_object()
        department.delete()
