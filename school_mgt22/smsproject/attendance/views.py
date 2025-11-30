from rest_framework import generics
from .models import Attendance
from .serializers import AttendanceSerializer

# List all attendance records or create a new one
class AttendanceListCreate(generics.ListCreateAPIView):
    queryset = Attendance.objects.all().order_by('-date')  # newest first
    serializer_class = AttendanceSerializer

# Retrieve, update, or delete a single attendance record
class AttendanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer



