from django.core.mail import send_mail
import random

def generate_verification_code(length=6):
    """Generate a random verification code."""
    code = ''.join(random.choices('0123456789', k=length))
    return code

def send_verification_email(user, code):
    """Send verification email to the user."""
    subject = 'Email Verification Code'
    message = f'Your email-change verification code is: {code}'
    from_email = 'support@spikywaves.com'
    to_email = user.email
    send_mail(subject, message, from_email, [to_email])

def send_reset_pass_link(user, link):
    """Send password reset link to the user"""
    subject = 'Password Reset Link'
    message = f'Your password reset link is: {link}'
    from_email = 'support@spikywaves.com'
    to_email = user.email
    send_mail(subject, message, from_email, [to_email])
    