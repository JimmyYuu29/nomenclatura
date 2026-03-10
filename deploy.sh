#!/bin/bash
# Script de despliegue para Nomenclatura App (sin Docker)
# Uso: ./deploy.sh

set -e

APP_DIR="/var/www/nomenclatura-app"
NGINX_CONF="/etc/nginx/sites-available/nomenclatura"
NGINX_ENABLED="/etc/nginx/sites-enabled/nomenclatura"

echo "=== Despliegue de Nomenclatura App ==="

# 1. Instalar dependencias y construir
echo "[1/5] Instalando dependencias..."
npm ci

echo "[2/5] Construyendo la aplicación..."
npm run build

# 3. Copiar archivos al directorio de producción
echo "[3/5] Copiando archivos a ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}"
sudo cp -r dist/* "${APP_DIR}/"
sudo chown -R www-data:www-data "${APP_DIR}"

# 4. Configurar Nginx
echo "[4/5] Configurando Nginx..."
sudo cp nginx/nomenclatura.conf "${NGINX_CONF}"
if [ ! -L "${NGINX_ENABLED}" ]; then
    sudo ln -s "${NGINX_CONF}" "${NGINX_ENABLED}"
fi
sudo nginx -t

# 5. Recargar Nginx
echo "[5/5] Recargando Nginx..."
sudo systemctl reload nginx

echo "=== Despliegue completado ==="
echo "La aplicación está disponible en el servidor."
