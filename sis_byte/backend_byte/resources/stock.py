from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from db import db
from models.stock import Stock
from schemas.stock import StockBaseSchema, StockCreateSchema, StockUpdateSchema
from resources.decorators import roles_required

blp = Blueprint(
    "Stock", __name__,
    url_prefix="/api/stock",
    description="CRUD de Stock (administrador & cosecha)"
)

@blp.route("")
class StockList(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.response(200, StockBaseSchema(many=True))
    def get(self):
        """Listar todo el stock."""
        return Stock.query.all()

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "cosecha")
    @blp.arguments(StockCreateSchema)
    @blp.response(201, StockBaseSchema)
    def post(self, data):
        """
        Crear un nuevo producto en el stock (sin registrar kilos aún).
        Los kilos se registran desde ingresos_stock.
        """
        prod = data["producto"]
        if Stock.query.filter_by(producto=prod).first():
            abort(400, message="Ya existe un producto con ese nombre")

        stock = Stock(
            producto=prod,
            precio_unitario=data["precio_unitario"]
        )
        db.session.add(stock)
        db.session.commit()
        return stock

@blp.route("/<int:id_stock>")
class StockDetail(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @blp.response(200, StockBaseSchema)
    def get(self, id_stock):
        """Obtener un producto de stock por ID."""
        return Stock.query.get_or_404(id_stock)

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "cosecha")
    @blp.arguments(StockUpdateSchema)
    @blp.response(200, StockBaseSchema)
    def put(self, data, id_stock):
        """
        Actualizar el nombre del producto o su precio unitario.
        """
        stock = Stock.query.get_or_404(id_stock)

        nuevo_nombre = data.get("producto")
        if nuevo_nombre and nuevo_nombre != stock.producto:
            if Stock.query.filter(Stock.producto == nuevo_nombre, Stock.id_stock != id_stock).first():
                abort(400, message="Ya existe otro producto con ese nombre")
            stock.producto = nuevo_nombre

        if "precio_unitario" in data:
            stock.precio_unitario = data["precio_unitario"]

        db.session.commit()
        return stock

    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    @roles_required("administrador", "cosecha")
    @blp.response(204)
    def delete(self, id_stock):
        """Eliminar un producto del stock."""
        stock = Stock.query.get_or_404(id_stock)
        db.session.delete(stock)
        db.session.commit()
        return "", 204
