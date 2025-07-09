# app.py

from flask import Flask
from flask_cors import CORS
from db import db, migrate
from flask_jwt_extended import JWTManager
from flask_smorest import Api
from dotenv import load_dotenv
import os

from resources.dashboard import blp as DashboardBlueprint
from resources.auth import blp as AuthBlueprint
from resources.users import blp as UsersBlueprint
from resources.clientes import blp as ClientesBlueprint
from resources.presupuesto import blp as PresupuestoBlueprint
from resources.stock import blp as StockBlueprint
from resources.ingreso_stock import blp as IngresoStockBluePrint
from resources.ventas import blp as VentasBluePrint
from resources.trama_resource import trama_bp as TramaBlueprint




load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI']      = os.getenv("DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY']               = os.getenv("JWT_SECRET_KEY")


    CORS(app, origins="*", supports_credentials=True)


    app.config['API_TITLE']            = 'Sistema de Gestión'
    app.config['API_VERSION']          = 'v1'
    app.config['OPENAPI_VERSION']      = '3.0.3'
    app.config['OPENAPI_URL_PREFIX']   = '/docs'
    app.config['OPENAPI_SWAGGER_UI_PATH'] = '/'
    app.config['OPENAPI_SWAGGER_UI_URL']  = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'
    app.config['API_SPEC_OPTIONS'] = {
        'security': [{'BearerAuth': []}],
        'components': {
            'securitySchemes': {
                'BearerAuth': {
                    'type': 'http',
                    'scheme': 'bearer',
                    'bearerFormat': 'JWT'
                }
            }
        }
    }

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    api = Api(app)
    api.spec.components.security_scheme("BearerAuth", {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
    })

    api.register_blueprint(AuthBlueprint,      url_prefix='/api/auth')
    api.register_blueprint(DashboardBlueprint, url_prefix='/api')
    api.register_blueprint(UsersBlueprint) 
    api.register_blueprint(ClientesBlueprint, url_prefix='/api/clientes')
    api.register_blueprint(PresupuestoBlueprint)
    api.register_blueprint(StockBlueprint)
    api.register_blueprint(IngresoStockBluePrint)
    api.register_blueprint(VentasBluePrint)
    api.register_blueprint(TramaBlueprint, url_prefix='/api/trama')




    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
