# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from rest_framework.authtoken.models import Token

# Create your models here.


CATEGORY = (
    ('movie', 'Movie'),
    ('tv_show', 'TV Show'),
    ('action_movie', 'Action Movie'),
    ('music', 'Music')
)

RIGHTS = (
    ('india', 'India'),
    ('us', 'USA'),
    ('china', 'China'),
    ('australia', 'Australia'),
    ('europe', 'Europe')
)

CURRENCY = (
    ('inr', 'INR'),
    ('us_dollar', 'US Dollar'),
    ('pound', 'Pound')
)

GENDER = (
    ('male', 'Male'),
    ('female', 'female'),
    ('others', 'Others')
)


class PeopleManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        print "Models: ", email, password
        if not email:
            raise ValueError('Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        create_token = Token.objects.create(user=user)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class People(AbstractUser):
    username = None
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    gender = models.CharField(max_length=10, blank=False)
    email = models.EmailField(blank=False, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'gender']

    objects = PeopleManager()

    def __unicode__(self):
        return "({}, {})".format(self.first_name, self.email)


class Content(models.Model):
    user = models.ForeignKey(People, related_name='people_content')
    genre = models.CharField(max_length=30, blank=False)
    story = models.TextField(blank=False)
    category = models.CharField(max_length=30, blank=False, choices=CATEGORY)
    geographical_rights = models.CharField(max_length=30, blank=False, choices=RIGHTS)
    currency = models.CharField(max_length=10, blank=False, choices=CURRENCY)
    price = models.FloatField(blank=False)
