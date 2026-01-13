#!/bin/bash

# Script per avviare il server PHP per SimFito Mobile Backend
# Uso: ./start-backend.sh

cd "$(dirname "$0")/backend" || exit

echo "🚀 Avviando PHP server su http://localhost:8000"
echo "   Backend: $PWD"
echo "   Premi Ctrl+C per stoppare"
echo ""

php -S localhost:8000 2>&1 | grep -v "127.0.0.1"
