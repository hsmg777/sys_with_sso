# resources/dashboard.py
from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from resources.decorators import roles_required

blp = Blueprint("Dashboard", __name__, description="Dashboards para administradores")

@blp.route("/dashboard")
class DashboardResource(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @roles_required("administrador")
    def get(self):
        # retornar datos mock o resumen
        return {
            "ingresos_vs_gastos": [],
            "presupuesto_ejecutado_vs_estimado": [],
            "pendientes_por_cobrar": []
        }
