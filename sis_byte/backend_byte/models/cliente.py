from db import db

class Cliente(db.Model):
    __tablename__ = "clientes"

    id_cliente = db.Column(db.Integer, primary_key=True)
    nombre     = db.Column(db.String(120), nullable=False)
    telefono   = db.Column(db.String(50), nullable=True)
    email      = db.Column(db.String(120), nullable=False, unique=True)
    direccion  = db.Column(db.Text, nullable=True)

