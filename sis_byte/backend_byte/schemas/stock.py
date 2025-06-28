from marshmallow import Schema, fields, validate

# === SCHEMAS DE STOCK ===

class StockBaseSchema(Schema):
    id_stock        = fields.Int(dump_only=True)
    producto        = fields.Str(required=True)
    cantidad_total  = fields.Decimal(as_string=True)
    precio_unitario = fields.Decimal(as_string=True)
    fecha_registro  = fields.DateTime()

class StockCreateSchema(Schema):
    producto        = fields.Str(required=True, validate=validate.Length(min=1))
    precio_unitario = fields.Decimal(required=True, as_string=True)

class StockUpdateSchema(Schema):
    producto        = fields.Str(validate=validate.Length(min=1))
    precio_unitario = fields.Decimal(as_string=True)


# === SCHEMAS DE INGRESOS ===

class IngresoStockBaseSchema(Schema):
    id_ingreso     = fields.Int(dump_only=True)
    id_stock       = fields.Int()
    kilos          = fields.Decimal(as_string=True)
    fecha_ingreso  = fields.Date()
    sala           = fields.Str()
    break_number   = fields.Str()

class IngresoStockCreateSchema(Schema):
    id_stock       = fields.Int(required=True)
    kilos          = fields.Decimal(required=True, as_string=True)
    fecha_ingreso  = fields.Date()
    sala           = fields.Str()
    break_number   = fields.Str()
