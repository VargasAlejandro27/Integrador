#!/bin/bash
# start-servers.sh - Script para iniciar ambos servidores en Linux/Mac

echo ""
echo "================================"
echo "Carbon Calculator - Start Servers"
echo "================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no está instalado"
    echo "Descarga Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Error: npm no está instalado"
    exit 1
fi

# Obtener la ruta del proyecto
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Función para mostrar error y salir
error_exit() {
    echo "Error: $1"
    exit 1
}

# Iniciar Backend
echo "Iniciando Backend (Puerto 3000)..."
cd "$PROJECT_DIR/backend" || error_exit "No se puede entrar a la carpeta backend"
npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar Frontend
echo "Iniciando Frontend (Puerto 5173)..."
cd "$PROJECT_DIR/frontend" || error_exit "No se puede entrar a la carpeta frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "Servidores iniciados:"
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:5173"
echo "================================"
echo ""
echo "Para detener los servidores, presiona Ctrl+C"
echo ""

# Esperar a que ambos procesos terminen
wait $BACKEND_PID $FRONTEND_PID
