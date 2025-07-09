from marshmallow import Schema, fields

class TramaSchema(Schema):
    trama = fields.Str(required=True)
