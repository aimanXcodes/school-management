from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    
    student_name = serializers.CharField(source='student.user.first_name', read_only=True)
    student_last_name = serializers.CharField(source='student.user.last_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'student_last_name', 'date', 'status']





