from rest_framework import serializers
from .models import Student
from accounts.models import UserProfile

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'full_name', 'email', 'roll_number', 'grade']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def validate(self, data):
        user_id = self.initial_data.get("user")
        if not user_id:
            raise serializers.ValidationError("User field is required.")

        try:
            profile = UserProfile.objects.get(id=user_id)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        if profile.role != "student":
            raise serializers.ValidationError("This user is not assigned the 'student' role.")

        return data