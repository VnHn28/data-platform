from rest_framework.routers import DefaultRouter
from .views import DatasetViewSet, AccessRequestViewSet

router = DefaultRouter()
router.register(r"datasets", DatasetViewSet, basename="dataset")
router.register(r"access-requests", AccessRequestViewSet, basename="accessrequest")

urlpatterns = router.urls
