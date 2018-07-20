from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
import views

router = DefaultRouter()

router.register(r'login', views.LoginView, base_name='login'),
router.register(r'signup', views.SignUpView, base_name='signup'),
router.register(r'content', views.ContentView, base_name='content'),


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^logout', views.LogoutAPIView.as_view(), name='logout'),
]
