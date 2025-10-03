#!/bin/sh
set -e

# Nginx backend URL (for server-side proxy) - uses internal service name in k8s
NGINX_BACKEND_URL=${NGINX_BACKEND_URL:-"http://localhost:8010"}

# Browser backend URL (for client-side API calls) - uses external/ingress URL
BROWSER_BACKEND_URL=${BROWSER_BACKEND_URL:-"http://localhost:8010"}

echo "Configuring nginx with backend URL: $NGINX_BACKEND_URL"
echo "Configuring browser with backend URL: $BROWSER_BACKEND_URL"

# Use envsubst to replace ${NGINX_BACKEND_URL} in nginx.conf
envsubst '${NGINX_BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Inject runtime config into index.html
echo "Injecting runtime config into index.html..."
cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: '${BROWSER_BACKEND_URL}'
};
EOF

echo "Starting nginx..."
exec "$@"