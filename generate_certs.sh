#!/bin/bash
# generate_certs.sh
# Generates a self-signed TLS certificate for the NGINX reverse proxy.
# Run this ONCE from the project root before docker compose up.
#
# Usage:  bash generate_certs.sh

set -e

CERT_DIR="./api-gateway/certs"
mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/nginx.key" \
  -out    "$CERT_DIR/nginx.crt" \
  -subj   "/C=CO/ST=Bogota/L=Bogota/O=Universidad Nacional de Colombia/CN=localhost"

echo ""
echo "✅  Certificate generated:"
echo "    $CERT_DIR/nginx.crt"
echo "    $CERT_DIR/nginx.key"
echo ""
echo "Next steps:"
echo "  docker compose up --build"
echo "  Then access: https://localhost:8443"
