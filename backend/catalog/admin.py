from django.contrib import admin
from .models import User, Dataset, AccessRequest

admin.site.register(User)
admin.site.register(Dataset)
admin.site.register(AccessRequest)
