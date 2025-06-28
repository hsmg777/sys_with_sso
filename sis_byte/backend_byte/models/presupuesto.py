from db import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func, select    

class PresupuestoItem(db.Model):
    __tablename__ = 'presupuesto_items'

    id_item = db.Column(db.Integer, primary_key=True)
    nombre  = db.Column(db.String(255), nullable=False)
    total   = db.Column(db.Numeric(12,2), nullable=False, default=0)

    subitems = db.relationship(
        'PresupuestoSubitem',
        back_populates='item',
        cascade='all, delete-orphan'
    )

    @hybrid_property
    def calculado(self):
        # Suma de todos los precios unitarios de sus subitems
        return sum(s.precio_unitario for s in self.subitems) or 0

    @calculado.expression
    def calculado(cls):
        return (
            select(func.coalesce(func.sum(PresupuestoSubitem.precio_unitario), 0))
            .where(PresupuestoSubitem.item_id == cls.id_item)
            .scalar_subquery()
        )


class PresupuestoSubitem(db.Model):
    __tablename__ = 'presupuesto_subitems'

    id_subitem     = db.Column(db.Integer, primary_key=True)
    item_id        = db.Column(db.Integer,
                               db.ForeignKey('presupuesto_items.id_item', ondelete='CASCADE'),
                               nullable=False)
    nombre         = db.Column(db.String(255), nullable=False)
    cantidad       = db.Column(db.Numeric(12,2), nullable=False)
    unidad         = db.Column(db.String(50), nullable=False)
    precio_unitario= db.Column(db.Numeric(12,2), nullable=False)

    item = db.relationship('PresupuestoItem', back_populates='subitems')
