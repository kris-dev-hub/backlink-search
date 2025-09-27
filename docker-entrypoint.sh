#!/bin/sh
set -e

# Default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-"http://localhost:8010"}

echo "Configuring nginx with backend URL: $BACKEND_URL"

# Use envsubst to replace ${BACKEND_URL} in nginx.conf
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "Starting nginx..."
exec "$@"