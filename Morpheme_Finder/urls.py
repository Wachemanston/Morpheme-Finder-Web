from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from app.views import index, query

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^index/$', index),
    url(r'^q/$', query)
]
