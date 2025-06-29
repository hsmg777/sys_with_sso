import pyotp
import json
import os

TOTP_FILE = "totp_secrets.json"

# Cargar secretos desde archivo si existe
if os.path.exists(TOTP_FILE):
    with open(TOTP_FILE, "r") as f:
        USER_TOTP_SECRETS = json.load(f)
else:
    USER_TOTP_SECRETS = {}

def save_secrets():
    with open(TOTP_FILE, "w") as f:
        json.dump(USER_TOTP_SECRETS, f)

def generate_totp_secret_for_user(username):
    """
    Genera un nuevo secreto TOTP para el usuario si no existe.
    """
    if username not in USER_TOTP_SECRETS:
        secret = pyotp.random_base32()
        USER_TOTP_SECRETS[username] = secret
        save_secrets()
    return USER_TOTP_SECRETS[username]

def get_user_totp_secret(username):
    """
    Obtiene el secreto TOTP asignado al usuario.
    """
    return USER_TOTP_SECRETS.get(username)

def verify_totp(username, otp_code):
    """
    Verifica el código OTP usando el secreto TOTP del usuario.
    """
    secret = get_user_totp_secret(username)
    if not secret:
        return False
    totp = pyotp.TOTP(secret)
    return totp.verify(otp_code, valid_window=1)
