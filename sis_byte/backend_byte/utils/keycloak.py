import os
import json
import requests
import jwt
from flask import request, abort, g

KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "MultiAppRealm")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "admin-client")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")
KEYCLOAK_ADMIN_USER = os.getenv("KEYCLOAK_ADMIN_USER")
KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD")

_jwks = None

def get_jwks():
    global _jwks
    if not _jwks:
        resp = requests.get(f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs")
        _jwks = resp.json()
    return _jwks

def decode_token(token):
    jwks = get_jwks()
    headers = jwt.get_unverified_header(token)
    key = next((k for k in jwks['keys'] if k['kid'] == headers['kid']), None)
    if not key:
        raise Exception("No matching key found in JWKS")
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
    payload = jwt.decode(
        token,
        public_key,
        algorithms=["RS256"],
        audience=KEYCLOAK_CLIENT_ID,
        options={"verify_exp": True}
    )
    return payload

def require_token(f):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", None)
        if not auth or not auth.startswith("Bearer "):
            abort(401, "Falta token de autenticación")
        token = auth.split(" ")[1]
        try:
            payload = decode_token(token)
            g.current_user = payload  # ← Correcto
        except Exception as e:
            abort(401, f"Token inválido: {str(e)}")
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

def roles_required(*roles):
    def decorator(f):
        def wrapper(*args, **kwargs):
            user = getattr(g, "current_user", None)
            if not user:
                abort(403, "No autenticado")
            token_roles = user.get("realm_access", {}).get("roles", [])
            if not any(r in token_roles for r in roles):
                abort(403, "No tienes permisos suficientes")
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def get_admin_token():
    response = requests.post(
        f"{KEYCLOAK_URL}/realms/master/protocol/openid-connect/token",
        data={
            "client_id": "admin-cli",
            "grant_type": "password",
            "username": KEYCLOAK_ADMIN_USER,
            "password": KEYCLOAK_ADMIN_PASSWORD
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if response.status_code != 200:
        raise Exception("No se pudo obtener token de admin Keycloak")
    return response.json()["access_token"]

def create_keycloak_user(username, email, password, first_name="", last_name="", role=None):
    token = get_admin_token()
    payload = {
        "username": username,
        "email": email,
        "enabled": True,
        "firstName": first_name,
        "lastName": last_name,
        "credentials": [{
            "type": "password",
            "value": password,
            "temporary": False
        }]
    }

    res = requests.post(
        f"{KEYCLOAK_URL}/admin/realms/{KEYCLOAK_REALM}/users",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        json=payload
    )

    if res.status_code != 201:
        raise Exception(f"Error al crear usuario: {res.text}")

    # Obtener el ID del usuario recién creado
    get_users = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{KEYCLOAK_REALM}/users",
        headers={"Authorization": f"Bearer {token}"},
        params={"username": username}
    )
    user_id = get_users.json()[0]["id"]

    # Asignar rol si se especificó
    if role:
        # Obtener ID del rol
        roles_res = requests.get(
            f"{KEYCLOAK_URL}/admin/realms/{KEYCLOAK_REALM}/roles",
            headers={"Authorization": f"Bearer {token}"}
        )
        role_obj = next((r for r in roles_res.json() if r["name"] == role), None)
        if not role_obj:
            raise Exception(f"El rol '{role}' no existe en Keycloak")

        assign_res = requests.post(
            f"{KEYCLOAK_URL}/admin/realms/{KEYCLOAK_REALM}/users/{user_id}/role-mappings/realm",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=[{
                "id": role_obj["id"],
                "name": role_obj["name"]
            }]
        )
        if assign_res.status_code != 204:
            raise Exception(f"Error al asignar rol: {assign_res.text}")

    return user_id
