from django.urls import path
from .views import UserProfileListCreate, UserProfileDetail

urlpatterns = [
    path('', UserProfileListCreate.as_view(), name='userprofile-list'),
    path('<int:pk>/', UserProfileDetail.as_view(), name='userprofile-detail'),
]
