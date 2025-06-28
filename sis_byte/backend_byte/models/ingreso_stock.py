# models/ingreso_stock.py
from db import db
from datetime import datetime
from sqlalchemy.orm import relationship

class IngresoStock(db.Model):
    __tablename__ = "ingresos_stock"

    id_ingreso     = db.Column(db.Integer, primary_key=True)
    id_stock       = db.Column(db.Integer, db.ForeignKey("stock.id_stock"), nullable=False)
    kilos          = db.Column(db.Numeric(12,2), nullable=False)
    fecha_ingreso  = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    sala           = db.Column(db.String(100), nullable=True)
    break_number   = db.Column(db.String(50), nullable=True)

