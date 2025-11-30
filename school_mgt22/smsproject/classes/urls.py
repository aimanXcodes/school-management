from django.urls import path
from .views import ClassRoomListCreate, ClassRoomDetail

urlpatterns = [
    path('', ClassRoomListCreate.as_view(), name='classroom-list'),
    path('<int:pk>/', ClassRoomDetail.as_view(), name='classroom-detail'),
]
