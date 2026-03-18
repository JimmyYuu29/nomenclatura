# Etapa 1: Construcción del frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Construcción del backend
FROM node:22-alpine AS backend-build

WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npx tsc

# Etapa 3: Producción (Node.js + Nginx)
FROM node:22-alpine AS production

RUN apk add --no-cache nginx

# Copiar frontend
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Copiar backend
WORKDIR /app/server
COPY --from=backend-build /app/server/dist ./dist
COPY --from=backend-build /app/server/node_modules ./node_modules
COPY --from=backend-build /app/server/package.json ./

# Script de inicio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
