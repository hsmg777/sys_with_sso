# models/pago_venta.py
from db import db
from datetime import date

class PagoVenta(db.Model):
    __tablename__ = 'pagos_venta'

    id_pago = db.Column(db.Integer, primary_key=True)
    id_venta = db.Column(db.Integer, db.ForeignKey('ventas.id_venta'), nullable=False)
    fecha_pago = db.Column(db.Date, default=date.today, nullable=False)
    monto = db.Column(db.Numeric(10,2), nullable=False)
    nro_documento = db.Column(db.String(100))
    observaciones = db.Column(db.Text)
