from marshmallow import Schema, fields, validate

class ClienteBaseSchema(Schema):
    id_cliente = fields.Int(dump_only=True)
    nombre     = fields.Str(required=True)
    telefono   = fields.Str(required=False)
    email      = fields.Email(required=True)
    direccion  = fields.Str(required=False)

class ClienteCreateSchema(ClienteBaseSchema):
    # hereda todos menos id, y no necesita load_only extra
    pass

class ClienteUpdateSchema(ClienteBaseSchema):
    nombre    = fields.Str(required=False)
    telefono  = fields.Str(required=False)
    email     = fields.Email(required=False)
    direccion = fields.Str(required=False)

class ClienteQuerySchema(Schema):
    nombre = fields.Str(required=False, load_default=None)
    email  = fields.Str(required=False, load_default=None)
