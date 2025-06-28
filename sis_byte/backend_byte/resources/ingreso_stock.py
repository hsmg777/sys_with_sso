from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from sqlalchemy import and_
from flask import request
from db import db
from models.ingreso_stock import IngresoStock
from models.stock import Stock
from schemas.stock import IngresoStockBaseSchema, IngresoStockCreateSchema
from resources.decorators import roles_required

blp = Blueprint(
    "IngresoStock", __name__,
    url_prefix="/api/ingresos",
    description="Registro de ingresos de stock"
)

@blp.route("")
class IngresoStockList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.response(200, IngresoStockBaseSchema(many=True))
    def get(self):
        stock_id = request.args.get("stock_id", type=int)

        if stock_id:
            return IngresoStock.query.filter_by(id_stock=stock_id).all()
        return IngresoStock.query.all()

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "cosecha")
    @blp.arguments(IngresoStockCreateSchema)
    @blp.response(201, IngresoStockBaseSchema)
    def post(self, data):
        """
        Registrar un nuevo ingreso de cosecha para un producto ya existente.
        Recalcula la cantidad total del producto luego del ingreso.
        """
        id_stock = data["id_stock"]
        stock = Stock.query.get(id_stock)
        if not stock:
            abort(404, message="Producto no encontrado")

        ingreso = IngresoStock(
            id_stock=id_stock,
            kilos=data["kilos"],
            fecha_ingreso=data.get("fecha_ingreso"),
            sala=data.get("sala"),
            break_number=data.get("break_number")
        )
        db.session.add(ingreso)

        # Recalcular el total del stock sumando todos sus ingresos
        stock.recalcular_total()
        db.session.commit()
        return ingreso

@blp.route("/<int:id_ingreso>")
class IngresoStockDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.response(200, IngresoStockBaseSchema)
    def get(self, id_ingreso):
        """Obtener ingreso por ID."""
        return IngresoStock.query.get_or_404(id_ingreso)

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador")
    @blp.response(204)
    def delete(self, id_ingreso):
        """Eliminar ingreso y actualizar stock."""
        ingreso = IngresoStock.query.get_or_404(id_ingreso)
        stock = ingreso.stock
        db.session.delete(ingreso)
        db.session.flush()
        stock.recalcular_total()
        db.session.commit()
        return "", 204
