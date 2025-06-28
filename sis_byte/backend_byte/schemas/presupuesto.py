from marshmallow import Schema, fields

class SubitemBaseSchema(Schema):
    id_subitem      = fields.Int(dump_only=True)
    item_id         = fields.Int(load_only=True)
    nombre          = fields.Str(required=True)
    cantidad        = fields.Decimal(required=True)
    unidad          = fields.Str(required=True)
    precio_unitario = fields.Decimal(required=True)

class SubitemCreateSchema(SubitemBaseSchema):
    # hereda todo menos id_subitem
    pass

class SubitemUpdateSchema(SubitemBaseSchema):
    nombre          = fields.Str(required=False)
    cantidad        = fields.Decimal(required=False)
    unidad          = fields.Str(required=False)
    precio_unitario = fields.Decimal(required=False)

class ItemBaseSchema(Schema):
    id_item = fields.Int(dump_only=True)
    nombre  = fields.Str(required=True)
    total   = fields.Decimal(dump_only=True)  # usa hybrid 'calculado'

class ItemCreateSchema(Schema):
    nombre = fields.Str(required=True)

class ItemUpdateSchema(Schema):
    nombre = fields.Str(required=False)
