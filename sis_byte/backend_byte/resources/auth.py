from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request, g
from utils.keycloak import require_token, create_keycloak_user
import requests
import os

blp = Blueprint("Auth", __name__, description="Operaciones de autenticación")

# Variables de entorno necesarias
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "MultiAppRealm")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "admin-client")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")

@blp.route("/perfil")
class Perfil(MethodView):
    @require_token
    def get(self):
        user = g.current_user
        print("🧠 Roles del usuario:", user.get("realm_access", {}).get("roles", []))
        return {
            "mensaje": "Acceso autorizado",
            "usuario": {
                "nombre": user.get("name"),
                "email": user.get("email"),
                "roles": user.get("realm_access", {}).get("roles", []),
                "sub": user.get("sub")
            }
        }

@blp.route("/register")
class Register(MethodView):
    def post(self):
        data = request.get_json()
        required_fields = ["username", "email", "password"]
        if not all(field in data for field in required_fields):
            return {"error": "Faltan campos obligatorios"}, 400

        try:
            user_id = create_keycloak_user(
                username=data["username"],
                email=data["email"],
                password=data["password"],
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                role=data.get("role")  # opcional
            )
            return {"mensaje": "Usuario creado exitosamente", "user_id": user_id}, 201
        except Exception as e:
            return {"error": str(e)}, 500

@blp.route("/login")
class Login(MethodView):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"error": "Faltan credenciales"}, 400

        try:
            response = requests.post(
                f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token",
                data={
                    "grant_type": "password",
                    "client_id": KEYCLOAK_CLIENT_ID,
                    "client_secret": KEYCLOAK_CLIENT_SECRET,
                    "username": username,
                    "password": password
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            if response.status_code != 200:
                return {"error": "Credenciales inválidas"}, 401

            token_data = response.json()
            return {
                "access_token": token_data["access_token"],
                "refresh_token": token_data.get("refresh_token"),
                "expires_in": token_data["expires_in"],
                "token_type": token_data["token_type"]
            }

        except Exception as e:
            return {"error": str(e)}, 500
