from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import Dataset, AccessRequest, User
from .serializers import DatasetSerializer, AccessRequestSerializer
from .permissions import IsAdmin, CanAccessDataset


class DatasetViewSet(ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated, CanAccessDataset]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return Dataset.objects.all()
        return Dataset.objects.filter(
            Q(sensitivity="public") |
            Q(owner_department=user.department)
        )

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            owner_department=self.request.user.department
        )


class AccessRequestViewSet(ModelViewSet):
    serializer_class = AccessRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return AccessRequest.objects.all()
        return AccessRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status=AccessRequest.Status.PENDING)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        req = self.get_object()
        req.status = AccessRequest.Status.APPROVED
        req.save()
        return Response({"status": req.status})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        req = self.get_object()
        req.status = AccessRequest.Status.REJECTED
        req.save()
        return Response({"status": req.status})
