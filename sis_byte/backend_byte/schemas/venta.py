from marshmallow import Schema, fields

# === DETALLE VENTA ===
class DetalleVentaBaseSchema(Schema):
    id_detalle = fields.Int(dump_only=True)
    id_venta = fields.Int()
    id_stock = fields.Int()
    kilos = fields.Decimal(as_string=True)
    precio = fields.Decimal(as_string=True)
    subtotal = fields.Decimal(as_string=True)

class DetalleVentaCreateSchema(Schema):
    id_stock = fields.Int(required=True)
    kilos = fields.Decimal(required=True, as_string=True)
    precio = fields.Decimal(required=True, as_string=True)
    subtotal = fields.Decimal(required=True, as_string=True)

class DetalleVentaUpdateSchema(Schema):
    kilos = fields.Decimal(as_string=True)
    precio = fields.Decimal(as_string=True)
    subtotal = fields.Decimal(as_string=True)

# === PAGO VENTA ===
class PagoVentaBaseSchema(Schema):
    id_pago = fields.Int(dump_only=True)
    id_venta = fields.Int()
    fecha_pago = fields.Date()
    monto = fields.Decimal(as_string=True)
    nro_documento = fields.Str()
    observaciones = fields.Str()

class PagoVentaCreateSchema(Schema):
    monto = fields.Decimal(required=True, as_string=True)
    fecha_pago = fields.Date()
    nro_documento = fields.Str()
    observaciones = fields.Str()

class PagoVentaUpdateSchema(Schema):
    monto = fields.Decimal(as_string=True)
    nro_documento = fields.Str()
    observaciones = fields.Str()

# === VENTA ===
class VentaBaseSchema(Schema):
    id_venta = fields.Int(dump_only=True)
    id_cliente = fields.Int()
    fecha = fields.Date()
    forma_pago = fields.Str()
    valor_total = fields.Decimal(as_string=True)
    abono = fields.Decimal(as_string=True)
    saldo_pendiente = fields.Decimal(as_string=True)
    numero_documento = fields.Str()
    estado = fields.Str()
    comentarios = fields.Str()
    detalles = fields.List(fields.Nested(DetalleVentaBaseSchema))
    pagos = fields.List(fields.Nested(PagoVentaBaseSchema))

# ✅ Ya sin abono
class VentaCreateSchema(Schema):
    id_cliente = fields.Int(required=True)
    fecha = fields.Date()
    forma_pago = fields.Str(required=True)
    numero_documento = fields.Str()
    comentarios = fields.Str()
    detalles = fields.List(fields.Nested(DetalleVentaCreateSchema), required=True)

class VentaUpdateSchema(Schema):
    forma_pago = fields.Str()
    comentarios = fields.Str()
    numero_documento = fields.Str()
