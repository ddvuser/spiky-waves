# Generated by Django 5.0.1 on 2024-02-06 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_alter_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='full_name',
            field=models.CharField(default='John Doe', max_length=49),
            preserve_default=False,
        ),
    ]
