from django.urls import path
from .views import TeacherListCreate, TeacherDetail

urlpatterns = [
    path('', TeacherListCreate.as_view(), name='teacher-list'),
    path('<int:pk>/', TeacherDetail.as_view(), name='teacher-detail'),
]
