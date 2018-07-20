# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-07-16 06:13
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0002_remove_people_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='Content',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre', models.CharField(max_length=30)),
                ('story', models.TextField()),
                ('category', models.CharField(choices=[('movie', 'Movie'), ('tv_show', 'TV Show'), ('action_movie', 'Action Movie'), ('music', 'Music')], max_length=30)),
                ('geographical_rights', models.CharField(choices=[('india', 'India'), ('us', 'USA'), ('china', 'China'), ('australia', 'Australia'), ('europe', 'Europe')], max_length=30)),
                ('currency', models.CharField(choices=[('inr', 'INR'), ('us_dollar', 'US Dollar'), ('pound', 'Pound')], max_length=10)),
                ('price', models.CharField(max_length=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='people_content', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
