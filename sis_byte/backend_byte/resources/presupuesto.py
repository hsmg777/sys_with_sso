from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from sqlalchemy.orm.exc import NoResultFound
from db import db
from models.presupuesto import PresupuestoItem, PresupuestoSubitem
from schemas.presupuesto import (
    ItemBaseSchema, ItemCreateSchema, ItemUpdateSchema,
    SubitemBaseSchema, SubitemCreateSchema, SubitemUpdateSchema
)
from resources.decorators import roles_required

blp = Blueprint(
    "Presupuestos", __name__,
    url_prefix="/api/presupuestos",
    description="CRUD de presupuestos (Items y Subitems)"
)

#
# -- Items --------------------------------------------------------
#
@blp.route("")
class ItemList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @blp.response(200, ItemBaseSchema(many=True))
    @jwt_required()
    def get(self):
        """Listar todos los ítems con su total calculado."""
        return PresupuestoItem.query.all()

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.arguments(ItemCreateSchema)
    @blp.response(201, ItemBaseSchema)
    def post(self, new_data):
        """Crear nuevo ítem (solo admin/contables)."""
        item = PresupuestoItem(nombre=new_data["nombre"])
        db.session.add(item)
        db.session.commit()
        return item

@blp.route("/<int:item_id>")
class ItemDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @blp.response(200, ItemBaseSchema)
    @jwt_required()
    def get(self, item_id):
        """Obtener un ítem por ID."""
        return PresupuestoItem.query.get_or_404(item_id)

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.arguments(ItemUpdateSchema)
    @blp.response(200, ItemBaseSchema)
    def put(self, update_data, item_id):
        """Actualizar nombre del ítem."""
        item = PresupuestoItem.query.get_or_404(item_id)
        if "nombre" in update_data:
            item.nombre = update_data["nombre"]
            db.session.commit()
        return item

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.response(204)
    def delete(self, item_id):
        """Eliminar ítem (y sus subitems)."""
        item = PresupuestoItem.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return "", 204

#
# -- Subitems -----------------------------------------------------
#
@blp.route("/<int:item_id>/subitems")
class SubitemList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @blp.response(201, SubitemBaseSchema (many=True))
    @jwt_required()
    def get(self, item_id):
        """Listar subítems de un ítem."""
        # forzar 404 si no existe
        _ = PresupuestoItem.query.get_or_404(item_id)
        return PresupuestoSubitem.query.filter_by(item_id=item_id).all()

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.arguments(SubitemCreateSchema)
    @blp.response(201, SubitemBaseSchema)
    def post(self, new_data, item_id):
        """Crear subítem y recalcular total."""
        # validar existencia del ítem padre
        item = PresupuestoItem.query.get_or_404(item_id)
        sub = PresupuestoSubitem(item_id=item_id, **new_data)
        db.session.add(sub)
        db.session.flush()
        # opcional: recalcular
        item.total = item.calculado
        db.session.commit()
        return sub

@blp.route("/<int:item_id>/subitems/<int:sub_id>")
class SubitemDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @blp.response(201, SubitemBaseSchema)
    @jwt_required()
    def get(self, item_id, sub_id):
        """Obtener un subítem."""
        return PresupuestoSubitem.query.filter_by(
            item_id=item_id, id_subitem=sub_id
        ).one_or_none() or abort(404)

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.arguments(SubitemUpdateSchema)
    @blp.response(200, SubitemBaseSchema)
    def put(self, upd, item_id, sub_id):
        """Actualizar subítem y recalcular total."""
        sub = PresupuestoSubitem.query.filter_by(
            item_id=item_id, id_subitem=sub_id
        ).one_or_none() or abort(404)
        for k, v in upd.items():
            setattr(sub, k, v)
        # recalcular padre
        sub.item.total = sub.item.calculado
        db.session.commit()
        return sub

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "contable")
    @blp.response(204)
    def delete(self, item_id, sub_id):
        """Eliminar subítem y recalcular total."""
        sub = PresupuestoSubitem.query.filter_by(
            item_id=item_id, id_subitem=sub_id
        ).one_or_none() or abort(404)
        item = sub.item
        db.session.delete(sub)
        db.session.flush()
        item.total = item.calculado
        db.session.commit()
        return "", 204
