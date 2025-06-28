# backend_byte/resources/users.py
from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from utils.keycloak import require_token, roles_required
from werkzeug.security import generate_password_hash
from db import db
from models.usuario import Usuario
from schemas.usuario import (
    UsuarioBaseSchema,
    UsuarioCreateSchema,
    UsuarioUpdateSchema,
    UsuarioFilterSchema,
)
from resources.decorators import roles_required

blp = Blueprint(
    "Users", __name__,
    url_prefix="/api/users",
    description="CRUD de Usuarios (sólo administrador)"
)

@blp.route("")
class UsersList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    #@require_token

    # @roles_required("administrador")
    # Si no quieres filtrar, simplemente no mandas query params
    @blp.arguments(UsuarioFilterSchema, location="query")
    @blp.response(200, UsuarioBaseSchema(many=True))
    def get(self, filters):
        """Listar usuarios, opcionalmente filtrando por nombre/email."""
        q = Usuario.query
        if filters.get("nombre"):
            q = q.filter(Usuario.nombre.ilike(f"%{filters['nombre']}%"))
        if filters.get("email"):
            q = q.filter(Usuario.email.ilike(f"%{filters['email']}%"))
        return q.all()

    @blp.doc(security=[{"BearerAuth": []}])
    #@require_token

   # @roles_required("administrador")
    @blp.arguments(UsuarioCreateSchema)      # contraseña obligatoria
    @blp.response(201, UsuarioBaseSchema)
    def post(self, new_data):
        """Crear un usuario (sólo admin)."""
        if Usuario.query.filter_by(email=new_data["email"]).first():
            abort(400, message="Ya existe un usuario con ese email")
        u = Usuario(
            nombre=new_data["nombre"],
            email=new_data["email"],
            contraseña=generate_password_hash(new_data["contraseña"]),
            rol=new_data["rol"]
        )
        db.session.add(u)
        db.session.commit()
        return u

@blp.route("/<int:user_id>")
class UserDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    #@require_token

   # @roles_required("administrador")
    @blp.response(200, UsuarioBaseSchema)
    def get(self, user_id):
        """Obtener un usuario por su ID."""
        return Usuario.query.get_or_404(user_id)

    @blp.doc(security=[{"BearerAuth": []}])
    #@require_token

   # @roles_required("administrador")
    # instanciamos el schema con partial=True
    @blp.arguments(UsuarioUpdateSchema(partial=True))
    @blp.response(200, UsuarioBaseSchema)
    def put(self, updated_data, user_id):
        """
        Actualizar un usuario.
        Puede venir cualquier subset de campos: nombre, email, rol y/o contraseña.
        """
        u = Usuario.query.get_or_404(user_id)

        # validación de email único
        if "email" in updated_data and updated_data["email"] != u.email:
            if Usuario.query.filter_by(email=updated_data["email"]).first():
                abort(400, message="Ya existe un usuario con ese email")

        # aplicamos cambios
        for field in ("nombre", "email", "rol"):
            if field in updated_data:
                setattr(u, field, updated_data[field])

        # si llega la contraseña, la re-hasheamos
        if "contraseña" in updated_data:
            u.contraseña = generate_password_hash(updated_data["contraseña"])

        db.session.commit()
        return u

    @blp.doc(security=[{"BearerAuth": []}])
    #@require_token

   # @roles_required("administrador")
    @blp.response(204)
    def delete(self, user_id):
        """Eliminar un usuario."""
        u = Usuario.query.get_or_404(user_id)
        db.session.delete(u)
        db.session.commit()
        return "", 204
