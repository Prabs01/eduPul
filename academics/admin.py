from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(Student)
admin.site.register(Course)
admin.site.register(CourseOffering)
admin.site.register(CourseEnrollment)
admin.site.register(Attendance)
admin.site.register(Faculty)
admin.site.register(TeachingAssignment)
admin.site.register(Program)
admin.site.register(Department)
admin.site.register(ProgramCourse)


