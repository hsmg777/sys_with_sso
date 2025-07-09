from flask_smorest import Blueprint
from schemas.trama_schema import TramaSchema
from Crypto.Cipher import AES
import base64

trama_bp = Blueprint('trama', 'trama', description="Trama API")

SECRET_KEY = b'clave-super-secreta-32bytes-!!!!'
IV = b'1234567890abcdef'

# Guarda el último mensaje recibido
ultimo_mensaje = None

def decrypt_trama(encrypted_text: str) -> str:
    try:
        encrypted_bytes = base64.b64decode(encrypted_text)
        cipher = AES.new(SECRET_KEY, AES.MODE_CBC, IV)
        decrypted_bytes = cipher.decrypt(encrypted_bytes)
        pad_len = decrypted_bytes[-1]
        decrypted_text = decrypted_bytes[:-pad_len].decode('utf-8')
        return decrypted_text
    except Exception as e:
        print(f"❌ Error al desencriptar: {str(e)}")
        raise

@trama_bp.route('/recibir', methods=["POST"])
@trama_bp.arguments(TramaSchema, location="json") 
def recibir_trama(payload):
    global ultimo_mensaje
    try:
        print(f"📦 Payload recibido: {payload}")
        encrypted_trama = payload['trama']

        mensaje = decrypt_trama(encrypted_trama)
        print(f"✅ Mensaje desencriptado recibido: {mensaje}")

        # Guarda el último mensaje
        ultimo_mensaje = mensaje

        return {
            "status": "ok",
            "mensaje": mensaje
        }, 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "error": "Error al procesar la trama",
            "detalle": str(e)
        }, 500

@trama_bp.route('/ultimo', methods=["GET"])
def obtener_ultimo_mensaje():
    """Devuelve el último mensaje recibido."""
    global ultimo_mensaje
    if ultimo_mensaje:
        return {"mensaje": ultimo_mensaje}, 200
    else:
        return {"mensaje": None}, 200
