# Backend de NutriRec

El backend de NutriRec es la base de una plataforma diseñada para la gestión de usuarios, ingredientes, recetas y preferencias alimentarias, ofreciendo funcionalidades como recomendaciones personalizadas y guardado de recetas favoritas. Este proyecto está desarrollado con Django y Django REST Framework.

## Tecnologías Utilizadas

- **Django**: Framework de Python para desarrollo web.
- **Django REST Framework**: Herramienta para construir APIs robustas con Django.
- **PostgreSQL**: Base de datos relacional.
- **JWT**: Autenticación basada en JSON Web Tokens con `djangorestframework-simplejwt`.
- **CORS**: Middleware para manejar CORS con `django-cors-headers`.
- **Gunicorn**: Servidor HTTP para despliegue en producción.
  
## Requisitos Previos
- Python 3.8 o superior.
- PostgreSQL 12 o superior.
- Pip y un entorno virtual (opcional pero recomendado).


## Endpoints Principales

### Autenticación
- **POST** `/api/auth/register/`: Registrar un nuevo usuario.
- **POST** `/api/auth/login/`: Iniciar sesión.
- **GET** `/api/auth/user/`: Ver información del usuario autenticado.

### Usuarios
- **GET** `/api/auth/user/`: Consultar información del usuario.
- **PUT** `/api/auth/user/`: Actualizar información del usuario.

### Ingredientes
- **GET** `/api/ingredientes/`: Listar todos los ingredientes disponibles.

### Recetas
- **GET** `/api/recetas/`: Consultar todas las recetas.
- **GET** `/api/recetas/{id}/`: Ver detalles de una receta específica.
- **POST** `/api/recetas/recomendaciones/`: Generar recomendaciones basadas en ingredientes seleccionados.

### Recetas Guardadas
- **POST** `/api/recetas-guardadas/`: Guardar una receta.
- **GET** `/api/recetas-guardadas/`: Listar recetas guardadas del usuario.
- **GET** `/api/recetas-guardadas/mas-guardadas/`: Consultar recetas más guardadas en un rango de fechas.

## Configuración de Base de Datos

La aplicación utiliza PostgreSQL como base de datos, configurada en el archivo `settings.py` de Django. Ejemplo de configuración:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'nutrirec_db',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
## Estructura de Carpetas

- **nutri_backend**: Configuración global de Django, incluye `settings.py`, `urls.py` y `wsgi.py`.
- **apps**:
  - **usuarios**: Gestión de usuarios y autenticación.
  - **ingredientes**: CRUD de ingredientes.
  - **recetas**: Gestión de recetas y recomendaciones.
  - **recetas_guardadas**: Sistema para guardar recetas favoritas.
  - **preferencias**: Gestión de preferencias alimentarias.

---

# Características Principales

- **Autenticación JWT**: Seguridad en las sesiones de usuario.
- **Recomendaciones Personalizadas**: Basadas en ingredientes seleccionados.
- **Gestión de Preferencias**: Filtrado de recetas según preferencias alimentarias.
- **Recetas Favoritas**: Guardado de recetas y consulta de las más populares.


# PRINCIPIOS SOLID Y PATRONES DE DISEÑO IMPLEMENTADOS (TAREA Aplicar Mejores Practicas en Core MVC)

## 1. Resumen de la Evolución del Proyecto

Este proyecto solía tener **toda la lógica** de cálculo nutricional y manejo de unidades directamente en el modelo `Receta`, lo que volvía el código difícil de mantener y poco extensible. Además, cada vez que se agregaba una nueva unidad de medida o lógica adicional (como recomendaciones), se duplicaba el código y se aumentaba la complejidad.

Para solucionar esto, se introdujeron **principios SOLID** y varios **patrones de diseño**, logrando un código más ordenado, mantenible y escalable.

---

## 2. ¿Qué se hacía antes?

1. **Cálculo de valores nutricionales en el modelo**  
   - El modelo `Receta` calculaba por sí solo las calorías, proteínas, etc., sumando complejidad al modelo.

2. **Unidades de medida acopladas**  
   - Se utilizaban condicionales dentro del modelo para convertir gramos, kilogramos, tazas, etc.  
   - Si queríamos agregar una unidad nueva, se modificaba el modelo (violando el principio de Abierto/Cerrado).

3. **Creación de objetos repetitiva**  
   - Para tests o scripts iniciales, se creaban recetas e ingredientes “a mano” en cada lugar, duplicando lógica.

4. **Falta de separación de responsabilidades**  
   - El modelo se encargaba de todo: datos, lógica de negocio, cálculo nutricional, etc.

---

## 3. ¿Qué se implementó ahora?

1. **Separación de la lógica nutricional (SRP)**  
   - Se creó un archivo `services.py` con la clase `RecetaNutricionalService` que se encarga del cálculo de macronutrientes.  
   - El modelo `Receta` ahora delega ese cálculo, cumpliendo el principio de Responsabilidad Única.

2. **Patrón Strategy para conversiones de unidad**  
   - Dentro del mismo `services.py`, definimos `UnitConversionStrategy`, un mapa que maneja la conversión de gramos, kilogramos, mililitros, etc.  
   - Si se desea agregar una nueva unidad, basta con extender este mapa, sin modificar el corazón de la lógica nutricional (principio Abierto/Cerrado).

3. **Patrón Factory para creación de recetas**  
   - El archivo `factories.py` encapsula la creación de recetas con sus ingredientes, evitando así repetir la misma lógica en distintos lugares del proyecto.

4. **Patrón Observer (opcional)**  
   - Se añadió (en algunos casos) un sistema de “observadores” que reacciona cada vez que se crea o actualiza una receta, sin acoplar esta lógica al modelo central.

---

## 4. Beneficios de estos cambios

- **Mantenibilidad:** Cada clase o módulo tiene una función clara; los cambios futuros se realizan de forma puntual.  
- **Extensibilidad:** Agregar nuevas unidades de medida o nueva lógica de recomendación no rompe el código existente.  
- **Reutilización de código:** Con `factories.py`, la creación de recetas ya no se repite en cada prueba o script.  
- **Arquitectura más limpia:** Los servicios y patrones hacen que el flujo de datos sea más sencillo de entender y depurar.

---

## 5. Estructura Principal de Archivos

- **`recetas/models.py`:**  
  - Contiene la clase `Receta`. Incluye un `@property` llamado `valores_nutricionales` que delega el cálculo a `RecetaNutricionalService`.
- **`recetas/services.py`:**  
  - `RecetaNutricionalService`: Lógica de cálculo de valores nutricionales.  
  - `UnitConversionStrategy`: Manejo de conversiones para distintas unidades (Patrón Strategy).
- **`recetas/factories.py`:**  
  - `RecetaFactory`: Crea objetos `Receta` con sus ingredientes de manera centralizada (Patrón Factory).
- *(Opcional)* **`recetas/signals.py` / `recetas/observers.py`:**  
  - Implementación de un sistema de notificaciones (Patrón Observer) cuando se crea o actualiza una receta.

---


## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nutrirec-backend.git
   cd nutrirec-backend
---
# Configuración del Proyecto

## Crear y activar un entorno virtual
```bash
    python -m venv env
    source env/bin/activate  # En Windows: env\Scripts\activate
```
## Instalar las dependencias del proyecto
    pip install -r requirements.txt
### Configurar las variables de entorno

# Crear archivo .env
echo "SECRET_KEY=tu_llave_secreta" > .env
echo "DEBUG=True" >> .env
echo "DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nutrirec_db" >> .env

# Aplicar las migraciones
python manage.py migrate

# Crear un superusuario
python manage.py createsuperuser

# Ejecutar el servidor de desarrollo
python manage.py runserver

# Despliegue

El despliegue del backend se realiza configurando las variables de entorno, utilizando **Gunicorn** como servidor de aplicaciones, y configurando un servidor web como **Nginx** para servir la aplicación en producción junto con una base de datos **PostgreSQL**.
