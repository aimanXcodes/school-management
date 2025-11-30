from django.db import models
from accounts.models import UserProfile
# Create your models here.

class Teacher(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.first_name} - {self.subject}"
