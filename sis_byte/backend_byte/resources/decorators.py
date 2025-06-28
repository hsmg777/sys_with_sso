# resources/decorators.py
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask_smorest import abort

def roles_required(*permitted_roles):
    def wrapper(fn):
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in permitted_roles:
                abort(403, message="No tienes permiso para este recurso")
            return fn(*args, **kwargs)
        decorator.__name__ = fn.__name__
        return decorator
    return wrapper


