# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.response import Response
from django.conf import settings
from rest_framework.views import APIView
from serializers import (
    PeopleSerializer,
    LoginSerializer,
    ContentSerializer
)

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from models import (
    People,
    Content,
    CATEGORY,
    CURRENCY,
    RIGHTS,
    GENDER
)
from rest_framework.exceptions import AuthenticationFailed, ParseError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q


from rest_framework import status
from rest_framework.exceptions import ValidationError


class LoginView(ViewSet):
    http_method_names = ['head', 'options', 'get', 'post']
    permission_classes = []
    authentication_classes = []
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = People.objects.get(email=self.request.data.get('email'))
            token, created = Token.objects.get_or_create(user=user)
            print "TOKEN, CREATED: ", token, created
            response = Response({
                "email": user.email,
                "first_name": user.first_name,
                "token": token.key
            })
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(ModelViewSet):
    http_method_names = ['head', 'options', 'post']
    authentication_classes = []
    permission_classes = []
    serializer_class = PeopleSerializer

    def create(self, request, *args, **kwargs):
        if self.request.data.get("email"):
            print "View: ", self.request.data
            if People.objects.filter(email=self.request.data.get('email')):
                return Response({"message": "User with this email id already exists"}
                                , status=status.HTTP_400_BAD_REQUEST)

            serializer = PeopleSerializer(data=request.data)
            if serializer.is_valid():
                print 'Serializer Data: ', serializer.data
                create_user = People.objects.create_user(**serializer.data)
                print "User Created"
                return Response({"message": "User successfully created"},
                                status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    """
    Logout user by clearing the token cookie
    """
    http_method_names = ['head', 'options', 'post']
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        response = Response({"message": "Successfully Logged Out"}, status=status.HTTP_200_OK)
        response.delete_cookie('token', '/')
        return response


class ContentView(ModelViewSet):
    """
    Perform CRUD operation on the content
    """
    http_method_names = ['get', 'head', 'options', 'post', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    serializer_class = ContentSerializer

    def get_queryset(self):
        print 'Content View: ', self.request.user
        return Content.objects.filter(user=self.request.user)

    def options(self, request, *args, **kwargs):
        return Response({
            'category': CATEGORY,
            'currency': CURRENCY,
            'rights': RIGHTS
        }, status=status.HTTP_200_OK)
