"""Agregar precio_unitario a stock y crear ingresos_stock

Revision ID: 4463d86d4a61
Revises: 31cc7ff5a18a
Create Date: 2025-05-31 22:39:32.071903
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4463d86d4a61'
down_revision = '31cc7ff5a18a'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla ingresos_stock
    op.create_table(
        'ingresos_stock',
        sa.Column('id_ingreso', sa.Integer(), primary_key=True),
        sa.Column('id_stock', sa.Integer(), sa.ForeignKey('stock.id_stock'), nullable=False),
        sa.Column('kilos', sa.Numeric(12, 2), nullable=False),
        sa.Column('fecha_ingreso', sa.Date(), nullable=False),
        sa.Column('sala', sa.String(100), nullable=True),
        sa.Column('break_number', sa.String(50), nullable=True)
    )

    # Añadir columna precio_unitario a stock con valor por defecto
    with op.batch_alter_table('stock', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('precio_unitario', sa.Numeric(10, 2), nullable=False, server_default="0.00")
        )


def downgrade():
    # Eliminar columna de stock
    with op.batch_alter_table('stock', schema=None) as batch_op:
        batch_op.drop_column('precio_unitario')

    # Eliminar tabla ingresos_stock
    op.drop_table('ingresos_stock')
