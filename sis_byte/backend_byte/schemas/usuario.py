from marshmallow import Schema, fields, validate

class UsuarioBaseSchema(Schema):
    """Campos comunes a crear y actualizar."""
    id_usuario = fields.Int(dump_only=True)
    nombre     = fields.Str(required=True)
    email      = fields.Email(required=True)
    rol        = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["administrador", "cosecha", "contable"],
            error="Rol inválido. Debe ser uno de: administrador, cosecha o contable."
        )
    )

class UsuarioCreateSchema(UsuarioBaseSchema):
    """Al crear siempre hace falta contraseña."""
    contraseña = fields.Str(
        load_only=True,
        required=True,
        validate=validate.Length(
            min=8, error="La contraseña debe tener al menos 8 caracteres"
        )
    )

class UsuarioUpdateSchema(UsuarioBaseSchema):
    """Al actualizar, la contraseña es opcional y nada es obligatorio."""
    # heredamos nombre/email/rol, pero marcamos todos como no-required
    nombre     = fields.Str(required=False)
    email      = fields.Email(required=False)
    rol        = fields.Str(
        required=False,
        validate=validate.OneOf(
            ["administrador", "cosecha", "contable"],
            error="Rol inválido. Debe ser uno de: administrador, cosecha o contable."
        )
    )
    contraseña = fields.Str(
        load_only=True,
        required=False,
        validate=validate.Length(
            min=8, error="La contraseña debe tener al menos 8 caracteres"
        )
    )

class UsuarioFilterSchema(Schema):
    """Esquema para validar query params en GET /api/users"""
    nombre = fields.Str(required=False)
    email  = fields.Email(required=False)
