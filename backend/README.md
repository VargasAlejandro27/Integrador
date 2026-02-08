# 🌍 Calculadora de Huella de Carbono - Express

Aplicación web para calcular tu huella de carbono personal con arquitectura dual-database.

**Tecnologías**: Node.js + Express | PostgreSQL (usuarios) | MongoDB (cálculos)

---

## 📋 REQUISITOS PREVIOS

### Instalaciones necesarias antes de comenzar:

#### 1. Node.js
- **Windows**: Descargar desde https://nodejs.org (versión 14+)
- **macOS**: `brew install node`
- **Linux**: `sudo apt-get install nodejs npm`

Verificar instalación:
```bash
node --version
npm --version
```

#### 2. PostgreSQL
- **Windows**: Descargar desde https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

Verificar instalación:
```bash
psql --version
```

#### 3. MongoDB
- **Windows**: Descargar desde https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

Verificar instalación:
```bash
mongosh --version
```

---

## 🚀 INSTALACIÓN Y CONFIGURACIÓN

### Paso 1: Clonar o descargar el proyecto
```bash
# Si está en una carpeta
cd calculadora-carbono-express
```

### Paso 2: Instalar todas las dependencias
```bash
npm install
```

### Paso 3: Verificar que PostgreSQL está corriendo

**Windows (PowerShell)**:
```powershell
Get-Service postgresql* | Select-Object Name, Status
```

**macOS/Linux**:
```bash
pg_isready
```

### Paso 4: Verificar que MongoDB está corriendo

**Windows**: MongoDB debe estar corriendo como servicio
```powershell
Get-Service MongoDB | Select-Object Name, Status
```

**macOS/Linux**:
```bash
mongosh --eval "db.adminCommand('ping')"
```

### Paso 5: Crear base de datos PostgreSQL

**Windows (cmd o PowerShell)**:
```bash
psql -U postgres
```

Dentro de psql, ejecutar:
```sql
CREATE DATABASE carbon_calculator;
\q
```

**macOS/Linux**:
```bash
createdb carbon_calculator
```

### Paso 6: Crear archivo `.env` en la raíz del proyecto

**Windows (PowerShell)**:
```powershell
@"
DB_USER=postgres
DB_HOST=localhost
DB_NAME=carbon_calculator
DB_PASSWORD=password
DB_PORT=5432
MONGO_URI=mongodb://localhost:27017/carbon_calculator
PORT=3000
SESSION_SECRET=ecocalc-secret-key-change-in-production
NODE_ENV=development
"@ | Out-File -Encoding UTF8 .env
```

**macOS/Linux (bash)**:
```bash
cat > .env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_NAME=carbon_calculator
DB_PASSWORD=password
DB_PORT=5432
MONGO_URI=mongodb://localhost:27017/carbon_calculator
PORT=3000
SESSION_SECRET=ecocalc-secret-key-change-in-production
NODE_ENV=development
EOF
```

### Paso 7: Crear usuario administrador

```bash
node create-admin.js
```

**Credenciales por defecto**:
- 📧 Email: `admin@ecocalc.com`
- 🔐 Contraseña: `admin123456`

### Paso 8: Iniciar el servidor

```bash
npm start
```

Deberías ver:
```
✅ Conexión a MongoDB establecida correctamente
✅ Base de datos PostgreSQL inicializada correctamente
Servidor corriendo en http://localhost:3000
```

### Paso 9: Acceder a la aplicación

Abre tu navegador y ve a: **http://localhost:3000**

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Verificar PostgreSQL
```bash
psql -U postgres -d carbon_calculator
SELECT * FROM users;
\q
```

### Verificar MongoDB
```bash
mongosh
use carbon_calculator
db.calculations.find()
exit
```

### Verificar API
```bash
curl http://localhost:3000
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Puerto 3000 ya está en uso

**Windows (PowerShell)**:
```powershell
$process = Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess
$process | Stop-Process -Force
```

**macOS/Linux**:
```bash
lsof -ti:3000 | xargs kill -9
```

### PostgreSQL no conecta

Verificar contraseña en `.env` coincide con la instalación.

```bash
psql -U postgres -h localhost
```

### MongoDB no conecta

Asegúrate que MongoDB está corriendo:

**Windows**:
```powershell
Start-Service MongoDB
```

**macOS**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongodb
```

---

## 📚 COMANDOS ÚTILES

### Desarrollo con auto-reload (necesita nodemon)
```bash
npm install -g nodemon
nodemon app.js
```

### Ver todas las dependencias instaladas
```bash
npm list
```

### Limpiar cache de npm
```bash
npm cache clean --force
```

### Reinstalar todas las dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cambiar contraseña del admin
1. Eliminar usuario admin en PostgreSQL:
```bash
psql -U postgres -d carbon_calculator
DELETE FROM users WHERE email = 'admin@ecocalc.com';
\q
```
2. Crear nuevo admin:
```bash
node create-admin.js
```

---

## 📊 ACCESO A INTERFACES

| URL | Función |
|-----|---------|
| http://localhost:3000 | Inicio |
| http://localhost:3000/login | Login de usuario |
| http://localhost:3000/registro | Registro de usuario |
| http://localhost:3000/calcular | Calculadora |
| http://localhost:3000/historial | Historial personal |
| http://localhost:3000/admin/login | Login de administrador |
| http://localhost:3000/admin/dashboard | Dashboard admin |

---

## 🛑 DETENER LA APLICACIÓN

- **Presionar**: `Ctrl + C` en la terminal donde corre el servidor

---

## 📋 CHECKLIST DE INSTALACIÓN

- [ ] Node.js instalado: `node --version`
- [ ] npm instalado: `npm --version`
- [ ] PostgreSQL instalado: `psql --version`
- [ ] MongoDB instalado: `mongosh --version`
- [ ] PostgreSQL corriendo (servicio activo)
- [ ] MongoDB corriendo (servicio activo)
- [ ] Carpeta del proyecto descargada
- [ ] `npm install` completado
- [ ] Archivo `.env` creado con credenciales
- [ ] Base de datos `carbon_calculator` creada
- [ ] Usuario admin creado: `node create-admin.js`
- [ ] Servidor iniciado: `npm start`
- [ ] Acceso en http://localhost:3000 ✅

---

## 📚 Documentación completa

Ver: [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)

---

**Versión**: 2.0 | PostgreSQL + MongoDB | Última actualización: Enero 2026
