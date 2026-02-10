from rest_framework.permissions import BasePermission
from .models import User

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.Role.ADMIN

class CanAccessDataset(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == User.Role.ADMIN:
            return True

        if obj.sensitivity == "public":
            return True

        if obj.owner_department == user.department:
            return True

        return False
