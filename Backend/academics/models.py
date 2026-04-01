from django.db import models
from accounts.models import User

# Create your models here.

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

class Program(models.Model):
    name = models.CharField(max_length=100)
    degree_type = models.CharField(max_length=50)
    duration_years = models.IntegerField()

    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    

class Student(models.Model):
    roll_no = models.CharField(max_length=20, unique=True)

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    date_of_birth = models.DateField()
    admission_year = models.IntegerField()

    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.roll_no
    
class Course(models.Model):
    course_code = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=100)

    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return self.course_code
    
class CourseOffering(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, null=True)

    semester = models.CharField(max_length=20)
    academic_year = models.IntegerField()
    section = models.CharField(max_length=10)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course", "semester", "academic_year", "section"],
                name="unique_course_offering"
            )
        ]

    def __str__(self):
        return f"{self.course} - {self.semester} {self.academic_year} ({self.section})"
    
class CourseEnrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE)

    enrollment_date = models.DateField()
    grade = models.CharField(max_length=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "offering"],
                name="unique_student_offering"
            )
        ]

    def __str__(self):
        return f"{self.student} - {self.offering}"
    

class Attendance(models.Model):
    enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)

    date = models.DateField()

    STATUS_CHOICES = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Late'),
    ]

    status = models.CharField(max_length=1,choices=STATUS_CHOICES)  # Present / Absent
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["enrollment", "date"],
                name="unique_attendance"
            )
        ]

    def __str__(self):
        return f"{self.enrollment} - {self.date}"
    

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    designation = models.CharField(max_length=50)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class TeachingAssignment(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE)

    role = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["faculty", "offering"],
                name="unique_faculty_offering"
            )
        ]


class ProgramCourse(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    course_type = models.CharField(max_length=50)  # core / elective

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["program", "course"],
                name="unique_program_course"
            )
        ]
    

