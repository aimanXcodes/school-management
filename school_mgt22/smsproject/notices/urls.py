from django.urls import path
from .views import NoticeListCreate, NoticeDetail

urlpatterns = [
    path('', NoticeListCreate.as_view(), name='notice-list-create'),
    path('<int:pk>/', NoticeDetail.as_view(), name='notice-detail'),
]
