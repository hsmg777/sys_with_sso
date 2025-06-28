import requests
from functools import wraps
from django.http import JsonResponse
from django.conf import settings
from jose import jwt, JWTError

# Configura tu realm y cliente
KEYCLOAK_REALM = 'MultiAppRealm'
KEYCLOAK_URL = 'http://localhost:8080'
KEYCLOAK_CLIENT_ID = 'frontend-nutri-client'

# Caching simple de la JWKS
JWKS_URL = f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"
JWKS = requests.get(JWKS_URL).json()

def decode_token(token):
    try:
        header = jwt.get_unverified_header(token)
        kid = header["kid"]
        key = next(k for k in JWKS["keys"] if k["kid"] == kid)
        return jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=KEYCLOAK_CLIENT_ID
        )
    except Exception as e:
        print(f"Token error: {e}")
        return None

def require_token(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        auth = request.headers.get('Authorization')
        if not auth or not auth.startswith('Bearer '):
            return JsonResponse({"detail": "No se proporcionó token."}, status=401)

        token = auth.split()[1]
        decoded = decode_token(token)
        if not decoded:
            return JsonResponse({"detail": "Token inválido o expirado."}, status=401)

        # Si necesitas puedes guardar el usuario en request
        request.keycloak_user = decoded
        return view_func(request, *args, **kwargs)
    return wrapped_view
