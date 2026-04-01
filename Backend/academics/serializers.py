from rest_framework import serializers
from .models import Student, Faculty, Course, CourseEnrollment,Department,Program


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


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"

    def create(self, validated_data):
        return Program.objects.create(
            name = validated_data["name"],
            degree_type = validated_data["degree_type"],
            duration_years = validated_data["duration_years"],
            department = validated_data["department"]
        )
    
    def list(self, validated_data):
        return Program.objects.all()
    
    def destroy(self, validated_data):
        program = self.get_object()
        program.delete()

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.degree_type = validated_data.get("degree_type", instance.degree_type)
        instance.duration_years = validated_data.get("duration_years", instance.duration_years)
        instance.department = validated_data.get("department", instance.department)
        instance.save()
        return instance