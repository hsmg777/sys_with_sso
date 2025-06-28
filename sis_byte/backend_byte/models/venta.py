from db import db
from datetime import date
from sqlalchemy.orm import relationship

class Venta(db.Model):
    __tablename__ = 'ventas'

    id_venta = db.Column(db.Integer, primary_key=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey('clientes.id_cliente'), nullable=False)
    fecha = db.Column(db.Date, default=date.today, nullable=False)
    forma_pago = db.Column(db.String(50), nullable=False)
    valor_total = db.Column(db.Numeric(10,2), nullable=False)
    abono = db.Column(db.Numeric(10,2), default=0)
    saldo_pendiente = db.Column(db.Numeric(10,2), default=0)
    numero_documento = db.Column(db.String(100))
    estado = db.Column(db.String(30), default='pendiente')
    comentarios = db.Column(db.Text)

    detalles = relationship('DetalleVenta', backref='venta', cascade="all, delete-orphan")
    pagos = relationship('PagoVenta', backref='venta', cascade="all, delete-orphan")


