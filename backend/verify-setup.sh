#!/bin/bash

# Script de verificación de instalación
# Ejecuta esto para verificar que todo está configurado correctamente

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ VERIFICACIÓN DE INSTALACIÓN - ECOCALC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✓ Node.js $NODE_VERSION"
else
    echo "   ✗ Node.js NO INSTALADO"
    exit 1
fi

# Verificar npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✓ npm $NPM_VERSION"
else
    echo "   ✗ npm NO INSTALADO"
    exit 1
fi

# Verificar PostgreSQL
echo "📦 Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo "   ✓ PostgreSQL $PG_VERSION"
else
    echo "   ✗ PostgreSQL NO INSTALADO"
    echo "   ⚠ Descárgalo de: https://www.postgresql.org/download/"
    exit 1
fi

# Verificar dependencias npm
echo "📦 Verificando dependencias npm..."
if [ -d "node_modules" ]; then
    echo "   ✓ node_modules existe"
else
    echo "   ✗ node_modules NO EXISTE"
    echo "   ↳ Ejecuta: npm install"
    exit 1
fi

# Verificar archivos críticos
echo "📄 Verificando archivos..."
FILES=("app.js" "db.js" "auth.js" ".env" "package.json")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ $file NO ENCONTRADO"
    fi
done

# Verificar base de datos
echo "🗄️  Verificando base de datos..."
if psql -lqt | cut -d \| -f 1 | grep -qw carbon_calculator; then
    echo "   ✓ Base de datos 'carbon_calculator' existe"
else
    echo "   ⚠ Base de datos 'carbon_calculator' NO EXISTE"
    echo "   ↳ Crea con: createdb carbon_calculator"
fi

# Verificar .env
echo "⚙️  Verificando variables de entorno..."
if [ -f ".env" ]; then
    echo "   ✓ Archivo .env existe"
    
    # Verificar contenido de .env
    if grep -q "DB_USER" .env; then
        echo "   ✓ DB_USER configurado"
    else
        echo "   ✗ DB_USER NO configurado"
    fi
    
    if grep -q "DB_PASSWORD" .env; then
        echo "   ✓ DB_PASSWORD configurado"
    else
        echo "   ✗ DB_PASSWORD NO configurado"
    fi
else
    echo "   ✗ Archivo .env NO EXISTE"
    echo "   ↳ Copia .env.example a .env y configúralo"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VERIFICACIÓN COMPLETADA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para iniciar la aplicación:"
echo "  npm start"
echo ""
echo "Accede a: http://localhost:3000"
echo ""
