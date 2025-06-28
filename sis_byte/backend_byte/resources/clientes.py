# resources/clientes.py
from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from db import db
from models.cliente import Cliente
from schemas.cliente import (
    ClienteBaseSchema,
    ClienteCreateSchema,
    ClienteUpdateSchema,
    ClienteQuerySchema
)
from resources.decorators import roles_required

blp = Blueprint(
    "Clientes", __name__,
    url_prefix="/api/clientes",
    description="CRUD de Clientes"
)

@blp.route("")
class ClientesList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.arguments(ClienteQuerySchema, location="query")
    @blp.response(200, ClienteBaseSchema(many=True))
    def get(self, filters):
        """
        Listar clientes con filtros opcionales.
        - ?nombre=foo buscará coincidencias en nombre o email
        - ?email=bar igual para email
        """
        query = Cliente.query
        nombre = filters.get("nombre")
        email  = filters.get("email")

        if nombre and email:
            term = f"%{nombre}%"
            query = query.filter(
                or_(Cliente.nombre.ilike(term),
                    Cliente.email.ilike(term))
            )
        elif nombre:
            query = query.filter(Cliente.nombre.ilike(f"%{nombre}%"))
        elif email:
            query = query.filter(Cliente.email.ilike(f"%{email}%"))

        return query.all()

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.arguments(ClienteCreateSchema)
    @blp.response(201, ClienteBaseSchema)
    def post(self, new_data):
        """Crear un cliente (sólo admin)."""
        if Cliente.query.filter_by(email=new_data["email"]).first():
            abort(400, message="Ya existe un cliente con ese email")
        cliente = Cliente(**new_data)
        db.session.add(cliente)
        db.session.commit()
        return cliente

@blp.route("/<int:cliente_id>")
class ClienteDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.response(200, ClienteBaseSchema)
    def get(self, cliente_id):
        """Obtener un cliente por ID."""
        return Cliente.query.get_or_404(cliente_id)

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador")
    @blp.arguments(ClienteUpdateSchema(partial=True))
    @blp.response(200, ClienteBaseSchema)
    def put(self, updated_data, cliente_id):
        """Actualizar un cliente (sólo admin)."""
        cliente = Cliente.query.get_or_404(cliente_id)
        if ("email" in updated_data and
            updated_data["email"] != cliente.email and
            Cliente.query.filter_by(email=updated_data["email"]).first()):
            abort(400, message="Ya existe un cliente con ese email")
        for field, val in updated_data.items():
            setattr(cliente, field, val)
        db.session.commit()
        return cliente

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador")
    @blp.response(204)
    def delete(self, cliente_id):
        """Eliminar un cliente (sólo admin)."""
        cliente = Cliente.query.get_or_404(cliente_id)
        db.session.delete(cliente)
        db.session.commit()
        return "", 204
