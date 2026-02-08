@echo off
REM start-servers.bat - Script para iniciar ambos servidores en Windows

echo.
echo ================================
echo Carbon Calculator - Start Servers
echo ================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js no está instalado o no está en el PATH
    echo Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Iniciar Backend
echo Iniciando Backend (Puerto 3000)...
start cmd /k "cd backend && npm run dev"

REM Esperar un poco para que el backend inicie
timeout /t 3 /nobreak

REM Iniciar Frontend
echo Iniciando Frontend (Puerto 5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo Servidores iniciados:
echo - Backend: http://localhost:3000
echo - Frontend: http://localhost:5173
echo ================================
echo.
echo Cierra estas ventanas cuando termines
pause
