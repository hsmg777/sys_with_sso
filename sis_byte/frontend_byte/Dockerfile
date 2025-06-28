# frontend_byte/Dockerfile
FROM node:18

WORKDIR /app

# Copiamos sólo package.json y package-lock para instalar deps
COPY package*.json ./

# Fijamos la variable para que Rollup no exija binarios nativos
ENV ROLLUP_NO_BINARY=true

RUN npm ci

# Copiamos el resto de la app
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos el dev server de Vite en 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
