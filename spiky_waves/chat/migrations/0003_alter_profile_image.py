# Generated by Django 5.0.1 on 2024-01-31 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='default_profile_pic.png', upload_to='uploads/profile_images/'),
        ),
    ]
