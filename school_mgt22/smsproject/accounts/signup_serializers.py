# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import UserProfile


# class AdminSignupSerializer(serializers.ModelSerializer):
#     """
#     Handles admin registration, creates both User and UserProfile entries.
#     """
#     password = serializers.CharField(write_only=True)
#     first_name = serializers.CharField()
#     last_name = serializers.CharField()
#     email = serializers.EmailField()

#     class Meta:
#         model = User
#         fields = ['username', 'first_name', 'last_name', 'email', 'password']

#     def create(self, validated_data):
#         # Step 1: Create User
#         password = validated_data.pop('password')
#         user = User(**validated_data)
#         user.set_password(password)
#         user.save()

#         # Step 2: Create matching UserProfile
#         UserProfile.objects.create(user=user, role='admin')

#         return user
