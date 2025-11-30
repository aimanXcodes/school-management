from django.db import models
from students.models import Student
from teachers.models import Teacher

class ClassRoom(models.Model):
    name = models.CharField(max_length=50)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    students = models.ManyToManyField(Student, blank=True)

    def __str__(self):
        return self.name
