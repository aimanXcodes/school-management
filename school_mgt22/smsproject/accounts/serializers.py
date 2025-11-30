from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserProfile
       
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
