from django.urls import path
from . import views

urlpatterns=[
    path('departments/create/', views.DepartmentViewSet.as_view({'post':'create'}), name='department-create'),
    path('departments/<int:pk>/delete/', views.DepartmentViewSet.as_view({'delete':'remove'}), name='department-delete'),
    path('departments/', views.DepartmentViewSet.as_view({'get':'list'}), name='department-list'),
    path('programs/', views.ProgramViewSet.as_view({'get':'list', 'post':'create'}), name='program-list'),
    path('programs/<int:pk>/', views.ProgramViewSet.as_view({'get':'retrieve', 'put':'update', 'patch': 'partial_update', 'delete':'destroy'}), name='program-detail'),   
]
