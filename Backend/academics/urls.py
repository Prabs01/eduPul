from django.urls import path
from . import views

urlpatterns=[
    path('departments/create/', views.DepartmentViewSet.as_view({'post':'create'}), name='department-create'),
    path('departments/<int:pk>/delete/', views.DepartmentViewSet.as_view({'delete':'remove'}), name='department-delete'),
    path('departments/', views.DepartmentViewSet.as_view({'get':'list'}), name='department-list'),
]