# Frontend de NutriRec

Este proyecto corresponde al frontend de **NutriRec**, una plataforma web diseñada para ofrecer recomendaciones personalizadas de recetas, gestionar ingredientes, guardar recetas favoritas y adaptar sugerencias según preferencias alimentarias. Este frontend está desarrollado con **Next.js** y utiliza **Tailwind CSS** para el diseño.

## Tecnologías Utilizadas

- **Next.js**: Framework para React que permite renderizado del lado del servidor y generación de sitios estáticos.
- **React**: Librería para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript que permite trabajar con tipado estático.
- **Tailwind CSS**: Framework de utilidades para estilizar la aplicación.
- **Axios**: Cliente HTTP utilizado para consumir las APIs del backend.
- **JWT**: Mecanismo de autenticación basado en tokens.

---

## Funcionalidades Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión con validación de credenciales.
- **Gestión de Ingredientes**: Selección de ingredientes para generar recetas personalizadas.
- **Recomendaciones de Recetas**: Consulta de recetas aptas según preferencias alimentarias y selección de ingredientes.
- **Guardado de Recetas Favoritas**: Guardar recetas y consultar las más populares.
- **Filtros por Fecha**: Filtrar las recetas más guardadas según un rango de fechas.

---

## Requisitos Previos

- **Node.js** 14 o superior.
- **NPM** o **Yarn** (gestores de paquetes).

---

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/nutrirec-frontend.git
   cd nutrirec-frontend
    ```

   
## Instalar las dependencias:

 ```
npm install
 ```
## Configurar las variables de entorno:

### Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:

  NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api

## Ejecutar el proyecto en desarrollo:
  npm run dev
  Abre el navegador y accede a http://localhost:3000.

## Estructura de Carpetas
  La estructura de carpetas sigue el enfoque de Next.js:
  
  src/
  ├── app/                     # Archivos de páginas y rutas principales
  │   ├── login/               # Página de inicio de sesión
  │   ├── register/            # Página de registro
  │   ├── ingredientes/        # Página para seleccionar ingredientes
  │   ├── recetas/             # Página para consultar recetas
  │   ├── styles/              # Archivos globales de estilos
  │   └── layout.tsx           # Layout principal de la aplicación
  ├── components/              # Componentes reutilizables (Header, Footer, Modales, etc.)
  ├── lib/                     # Funciones auxiliares (API, autenticación, etc.)
  ├── config/                  # Configuración de endpoints y constantes globales
  └── public/                  # Archivos públicos como imágenes y fuentes

## Endpoints Consumidos
  El frontend interactúa con el backend a través de los siguientes endpoints:

### Autenticación
  POST /auth/register/: Registrar un nuevo usuario.
  POST /auth/login/: Iniciar sesión.
  GET /auth/user/: Obtener la información del usuario autenticado.
### Ingredientes
  GET /ingredientes/: Listar todos los ingredientes disponibles.
### Recetas
  GET /recetas/: Consultar todas las recetas.
  GET /recetas/{id}/: Ver detalles de una receta.
  POST /recetas/recomendaciones/: Obtener recomendaciones de recetas basadas en ingredientes.
### Recetas Guardadas
  POST /recetas-guardadas/: Guardar una receta como favorita.
  GET /recetas-guardadas/: Listar las recetas guardadas del usuario.
  GET /recetas-guardadas/mas-guardadas/: Consultar las recetas más guardadas según un rango de fechas.
## Scripts Disponibles
  npm run dev: Inicia el servidor de desarrollo en http://localhost:3000.
  npm run build: Construye el proyecto para producción.
  npm run start: Inicia el servidor de producción después de construir.
  npm run lint: Ejecuta el linter para asegurar la calidad del código.
## Estilos
  El proyecto utiliza Tailwind CSS. Los estilos globales se definen en el archivo src/app/styles/globals.css. Para personalizar los colores y configuraciones, edita el archivo tailwind.config.js.

## Características Adicionales
  Autenticación JWT: Manejo seguro de sesiones de usuario.
  Persistencia de Sesión: Tokens almacenados en localStorage.
  Interfaz Dinámica: Modales y componentes dinámicos para mejorar la experiencia del usuario.
  Filtros por Fecha: Consultar las recetas más guardadas por otros usuarios según el rango de fechas seleccionado.
