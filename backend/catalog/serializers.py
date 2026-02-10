from rest_framework import serializers
from .models import Dataset, AccessRequest, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "role", "department"]

class DatasetSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Dataset
        fields = "__all__"

class AccessRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    dataset = DatasetSerializer(read_only=True)
    dataset_id = serializers.PrimaryKeyRelatedField(
        queryset=Dataset.objects.all(),
        source="dataset",
        write_only=True
    )

    class Meta:
        model = AccessRequest
        fields = [
            "id",
            "user",
            "dataset",
            "dataset_id",
            "reason",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "dataset", "status", "created_at", "updated_at"]
