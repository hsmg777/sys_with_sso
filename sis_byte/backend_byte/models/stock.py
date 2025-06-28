# models/stock.py
from db import db
from decimal import Decimal

class Stock(db.Model):
    __tablename__ = "stock"

    id_stock        = db.Column(db.Integer, primary_key=True)
    producto        = db.Column(db.String(255), nullable=False, unique=True)
    cantidad_total  = db.Column(db.Numeric(12,2), nullable=False, default=0)
    precio_unitario = db.Column(db.Numeric(10,2), nullable=False, default=Decimal("0.00"))
    fecha_registro  = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    ingresos = db.relationship("IngresoStock", backref="stock", cascade="all, delete-orphan")

    def recalcular_total(self):
        self.cantidad_total = sum(i.kilos for i in self.ingresos)
