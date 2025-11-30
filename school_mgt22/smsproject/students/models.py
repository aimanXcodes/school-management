from django.db import models
from accounts.models import UserProfile
# Create your models here.

class Student(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20, unique=True)
    grade = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.first_name} - {self.roll_number}"
