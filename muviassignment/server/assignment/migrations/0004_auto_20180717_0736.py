# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-07-17 07:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0003_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='price',
            field=models.FloatField(),
        ),
    ]
