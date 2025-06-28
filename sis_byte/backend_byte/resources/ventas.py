from flask.views import MethodView
from flask_smorest import Blueprint, abort
from db import db
from models.venta import Venta
from models.detalle_venta import DetalleVenta
from models.pago_venta import PagoVenta
from schemas.venta import (
    VentaBaseSchema, VentaCreateSchema, VentaUpdateSchema,
    DetalleVentaBaseSchema, DetalleVentaCreateSchema, DetalleVentaUpdateSchema,
    PagoVentaBaseSchema, PagoVentaCreateSchema, PagoVentaUpdateSchema
)
from decimal import Decimal

blp = Blueprint("Ventas", "ventas", url_prefix="/api/ventas", description="Operaciones de ventas")

# --------------------------
# Recursos para tabla VENTA
# --------------------------

@blp.route("/")
class VentaList(MethodView):
    @blp.response(200, VentaBaseSchema(many=True))
    def get(self):
        return Venta.query.all()

    @blp.arguments(VentaCreateSchema)
    @blp.response(201, VentaBaseSchema)
    def post(self, data):
        from models.stock import Stock  # asegúrate de importar el modelo

        # 1. Calcular el total desde los detalles
        valor_total = sum(Decimal(det["subtotal"]) for det in data["detalles"])
        abono = Decimal("0.00")
        saldo_pendiente = valor_total
        estado = "pendiente"

        # 2. Crear la venta
        nueva = Venta(
            id_cliente=data["id_cliente"],
            fecha=data.get("fecha"),
            forma_pago=data["forma_pago"],
            valor_total=valor_total,
            abono=abono,
            saldo_pendiente=saldo_pendiente,
            numero_documento=data.get("numero_documento"),
            comentarios=data.get("comentarios"),
            estado=estado
        )
        db.session.add(nueva)
        db.session.flush()  # Necesario para obtener nueva.id_venta

        # 3. Procesar cada detalle
        for det in data["detalles"]:
            id_stock = det["id_stock"]
            cantidad_vendida = Decimal(str(det["kilos"]))

            # Buscar stock
            stock = Stock.query.get(id_stock)
            if not stock:
                abort(404, message=f"Producto con id_stock={id_stock} no encontrado.")

            # Validar stock suficiente
            if stock.cantidad_total < cantidad_vendida:
                abort(400, message=f"No hay suficiente stock para el producto '{stock.producto}'. Disponible: {stock.cantidad_total}, requerido: {cantidad_vendida}.")

            # Descontar del stock
            stock.cantidad_total -= cantidad_vendida

            # Registrar el detalle
            detalle = DetalleVenta(id_venta=nueva.id_venta, **det)
            db.session.add(detalle)

        db.session.commit()
        return nueva


@blp.route("/<int:venta_id>")
class VentaById(MethodView):
    @blp.response(200, VentaBaseSchema)
    def get(self, venta_id):
        return Venta.query.get_or_404(venta_id)

    @blp.arguments(VentaUpdateSchema)
    @blp.response(200, VentaBaseSchema)
    def put(self, data, venta_id):
        venta = Venta.query.get_or_404(venta_id)
        for field, value in data.items():
            setattr(venta, field, value)
        db.session.commit()
        return venta

    def delete(self, venta_id):
        venta = Venta.query.get_or_404(venta_id)
        db.session.delete(venta)
        db.session.commit()
        return {"mensaje": "Venta eliminada"}

# -------------------------------------
# DETALLE VENTA: por cada venta específica
# -------------------------------------

@blp.route("/<int:venta_id>/detalles")
class DetalleVentaPorVenta(MethodView):
    @blp.response(200, DetalleVentaBaseSchema(many=True))
    def get(self, venta_id):
        return DetalleVenta.query.filter_by(id_venta=venta_id).all()

    @blp.arguments(DetalleVentaCreateSchema)
    @blp.response(201, DetalleVentaBaseSchema)
    def post(self, data, venta_id):
        detalle = DetalleVenta(id_venta=venta_id, **data)
        db.session.add(detalle)
        db.session.commit()
        return detalle

# -------------------------------------
# PAGOS VENTA: por cada venta específica
# -------------------------------------

@blp.route("/<int:venta_id>/pagos")
class PagoVentaPorVenta(MethodView):
    @blp.response(200, PagoVentaBaseSchema(many=True))
    def get(self, venta_id):
        return PagoVenta.query.filter_by(id_venta=venta_id).all()

    @blp.arguments(PagoVentaCreateSchema)
    @blp.response(201, PagoVentaBaseSchema)
    def post(self, data, venta_id):
        pago = PagoVenta(id_venta=venta_id, **data)
        db.session.add(pago)

        # Actualizar estado y saldo
        venta = Venta.query.get_or_404(venta_id)
        monto = Decimal(str(data["monto"]))
        venta.abono += monto
        venta.saldo_pendiente = venta.valor_total - venta.abono
        venta.estado = "cancelado" if venta.saldo_pendiente <= 0 else "pendiente"

        db.session.commit()
        return pago

# -------------------------------------
# Rutas individuales (por si se necesitan)
# -------------------------------------

@blp.route("/detalles/<int:detalle_id>")
class DetalleVentaById(MethodView):
    @blp.response(200, DetalleVentaBaseSchema)
    def get(self, detalle_id):
        return DetalleVenta.query.get_or_404(detalle_id)

    @blp.arguments(DetalleVentaUpdateSchema)
    @blp.response(200, DetalleVentaBaseSchema)
    def put(self, data, detalle_id):
        detalle = DetalleVenta.query.get_or_404(detalle_id)
        for field, value in data.items():
            setattr(detalle, field, value)
        db.session.commit()
        return detalle

    def delete(self, detalle_id):
        detalle = DetalleVenta.query.get_or_404(detalle_id)
        db.session.delete(detalle)
        db.session.commit()
        return {"mensaje": "Detalle eliminado"}

@blp.route("/pagos/<int:pago_id>")
class PagoVentaById(MethodView):
    @blp.response(200, PagoVentaBaseSchema)
    def get(self, pago_id):
        return PagoVenta.query.get_or_404(pago_id)

    @blp.arguments(PagoVentaUpdateSchema)
    @blp.response(200, PagoVentaBaseSchema)
    def put(self, data, pago_id):
        pago = PagoVenta.query.get_or_404(pago_id)
        for field, value in data.items():
            setattr(pago, field, value)
        db.session.commit()
        return pago

    def delete(self, pago_id):
        pago = PagoVenta.query.get_or_404(pago_id)
        db.session.delete(pago)
        db.session.commit()
        return {"mensaje": "Pago eliminado"}
