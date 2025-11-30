from rest_framework import generics
from .models import ClassRoom
from .serializers import ClassRoomSerializer

class ClassRoomListCreate(generics.ListCreateAPIView):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer

class ClassRoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer
