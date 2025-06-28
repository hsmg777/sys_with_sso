# models/detalle_venta.py
from db import db

class DetalleVenta(db.Model):
    __tablename__ = 'detalle_venta'

    id_detalle = db.Column(db.Integer, primary_key=True)
    id_venta = db.Column(db.Integer, db.ForeignKey('ventas.id_venta'), nullable=False)
    id_stock = db.Column(db.Integer, db.ForeignKey('stock.id_stock'), nullable=False)
    kilos = db.Column(db.Numeric(10,2), nullable=False)
    precio = db.Column(db.Numeric(10,2), nullable=False)
    subtotal = db.Column(db.Numeric(10,2), nullable=False)
