from rest_framework import serializers
from .models import ClassRoom

class ClassRoomSerializer(serializers.ModelSerializer):
    teacher_full_name = serializers.SerializerMethodField(read_only=True)
    student_names = serializers.SerializerMethodField()

    class Meta:
        model = ClassRoom
        fields = ['id', 'name', 'teacher', 'teacher_full_name', 'students', 'student_names']

    def get_teacher_full_name(self, obj):
        if obj.teacher and obj.teacher.user:
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
        return None

    def get_student_names(self, obj):
        names = []
        for s in obj.students.all():
            if s.user:
                names.append(f"{s.user.first_name} {s.user.last_name}")
        return names








    # def get_teacher_full_name(self, obj):
    #      return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"

  

    # def get_student_names(self, obj):
    #     return [f"{s.user.first_name} {s.user.last_name}" for s in obj.students.all()]