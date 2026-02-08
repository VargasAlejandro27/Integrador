# 🌍 Calculadora de Huella de Carbono

Aplicación web completa para calcular, gestionar y reducir tu huella de carbono.

**Proyecto actualizado desde el repositorio oficial:** [Huella_de_Carbono_DEV_Challenge](https://github.com/VargasAlejandro27/Huella_de_Carbono_DEV_Challenge.git)

---

## 📁 Estructura del Proyecto

```
carbon-calculator/
├── backend/                          # Servidor Express.js + MongoDB/PostgreSQL
│   ├── app.js                       # Aplicación principal de Express
│   ├── auth.js                      # Módulo de autenticación
│   ├── db.js                        # Configuración de base de datos
│   ├── mongo-db.js                  # Conexión a MongoDB
│   ├── create-admin.js              # Script para crear admin
│   ├── package.json                 # Dependencias del backend
│   ├── public/                      # Archivos estáticos
│   │   └── css/                     # Estilos CSS
│   ├── views/                       # Templates EJS
│   │   ├── index.ejs
│   │   ├── login.ejs
│   │   ├── registro.ejs
│   │   ├── calculate.ejs
│   │   ├── results.ejs
│   │   ├── history.ejs
│   │   ├── admin-dashboard.ejs
│   │   ├── admin-login.ejs
│   │   └── layout.ejs
│   ├── .env.example                 # Variables de entorno ejemplo
│   ├── DOCUMENTACION_COMPLETA.md    # Documentación completa
│   ├── INICIO_AQUI.md               # Guía de inicio
│   └── INSTALACION_RAPIDA.md        # Instalación rápida
│
├── frontend/                         # Aplicación React + Vite
│   ├── src/
│   │   ├── App.jsx                  # Componente principal
│   │   ├── main.jsx                 # Punto de entrada
│   │   ├── styles.css               # Estilos globales
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Calculate.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── History.jsx
│   │   │   └── Tips.jsx
│   │   ├── auth/                    # Componentes de autenticación
│   │   │   ├── AuthProvider.jsx
│   │   │   └── RequireAuth.jsx
│   │   └── utils/                   # Utilidades
│   │       └── colors.js
│   ├── public/
│   │   └── css/
│   │       ├── app.css
│   │       └── style.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore                        # Configuración de Git
├── README.md                         # Este archivo
└── [Otros archivos de configuración]
```

## ✅ Cambios Realizados

### 1. **Sincronización desde repositorio oficial**
   - ✅ Descargado el repositorio oficial de GitHub
   - ✅ Actualizado el backend con los últimos archivos (`app.js`, `auth.js`, `db.js`, etc.)
   - ✅ Actualizado las vistas EJS (`views/`)
   - ✅ Actualizado los estilos CSS público

### 2. **Correcciones CSS (Contraste de Colores)**
   - ✅ Fixed: Labels negros invisibles en modo oscuro
   - ✅ Añadido soporte completo para `prefers-color-scheme: dark`
   - ✅ Mejorado contraste en formularios de login/registro
   - ✅ Archivos modificados:
     - `frontend/src/styles.css`
     - `frontend/public/css/app.css`

### 3. **Estructura Mejorada del Backend** (NUEVO)
   - ✅ Creado `backend/routes/` con rutas organizadas:
     - `routes/index.js` - Rutas principales
     - `routes/auth.js` - Autenticación
     - `routes/calculate.js` - Cálculos de emisiones
     - `routes/admin.js` - Endpoints de administrador
   - ✅ Creado `backend/middleware/` para middlewares centralizados
     - `middleware/errorHandler.js` - Manejo de errores
   - ✅ Creado `backend/utils/emissionCalculator.js` con lógica reutilizable
   - ✅ Creado `backend/config.js` con configuración centralizada

### 4. **Scripts de Inicio Automático** (NUEVO)
   - ✅ `start-servers.bat` - Para Windows (inicia ambos servidores)
   - ✅ `start-servers.sh` - Para Linux/macOS (inicia ambos servidores)

### 5. **Documentación Profesional** (NUEVO)
   - ✅ `API_DOCUMENTATION.md` - Documentación completa de endpoints
   - ✅ `CONTRIBUTING.md` - Guía de contribución
   - ✅ `PROJECT_STRUCTURE.md` - Estructura del proyecto explicada
   - ✅ `.env.example` en raíz - Variables de entorno globales

### 6. **Configuración del Proyecto**
   - ✅ Creado `.gitignore` completo
   - ✅ Instaladas todas las dependencias del backend
   - ✅ Instaladas todas las dependencias del frontend
   - ✅ Verificada la estructura de carpetas

---

## 🚀 Inicio Rápido

### Método 1: Script automático (Recomendado)

**Windows:**
```bash
start-servers.bat
```

**Linux/macOS:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Método 2: Iniciar servidores manualmente

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

---

## 📍 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

---

## 📍 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Docs**: Consulta [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🔧 Requisitos

- **Node.js** v14 o superior
- **npm** v6 o superior
- **PostgreSQL** o **MongoDB** (configurable)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone <repositorio>
cd carbon-calculator
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 4. Iniciar la aplicación
```bash
# Opción 1: Con scripts automáticos
./start-servers.sh  # Linux/Mac
start-servers.bat   # Windows

# Opción 2: Manual
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 📚 Documentación

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Todos los endpoints API
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía para contribuidores
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Estructura del proyecto
- **[backend/README.md](backend/README.md)** - Documentación del backend
- **[frontend/README.md](frontend/README.md)** - Documentación del frontend
- **[backend/DOCUMENTACION_COMPLETA.md](backend/DOCUMENTACION_COMPLETA.md)** - Docs completas
- **[backend/INICIO_AQUI.md](backend/INICIO_AQUI.md)** - Guía de inicio rápido
- **[backend/INSTALACION_RAPIDA.md](backend/INSTALACION_RAPIDA.md)** - Instalación rápida

---

## 🏗️ Arquitectura

### Backend (Express.js)
- **Rutas API** organizadas por funcionalidad
- **Middleware** centralizado para autenticación y errores
- **Base de datos** PostgreSQL/MongoDB
- **Autenticación** con Passport.js
- **Sesiones** seguras con express-session

### Frontend (React + Vite)
- **Componentes** modulares y reutilizables
- **Context API** para estado global
- **React Router** para navegación
- **Vite** para build rápido
- **Estilos** CSS moderno con dark mode

---

## 🎯 Características

### ✅ Backend
- Autenticación con email/contraseña
- Cálculo preciso de emisiones de carbono
- API REST bien documentada
- Panel de administración
- Generación de reportes PDF
- Sesiones seguras
- Manejo centralizado de errores

### ✅ Frontend
- Interfaz moderna e intuitiva
- Formulario de cálculo interactivo
- Historial de cálculos
- Consejos personalizados
- Descarga de reportes
- Diseño responsive
- Soporte para dark mode
- Autenticación segura

---

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Sesiones seguras con cookies HttpOnly
- CSRF protection
- Validación de entrada
- Rate limiting (recomendado para producción)
- HTTPS obligatorio en producción

---

## 📊 Tecnologías Usadas

### Backend
- Express.js
- Passport.js
- MongoDB / PostgreSQL
- PDFKit
- Bcryptjs

### Frontend
- React 18
- Vite
- React Router v6
- CSS3 moderno

---

## 🚀 Próximos Pasos

1. Crear un usuario admin
   ```bash
   cd backend && node create-admin.js
   ```

2. Acceder a la aplicación
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

3. Revisar la documentación API
   - Consulta [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🤝 Contribuir

¿Quieres contribuir? ¡Excelente! Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo licencia MIT. Consulta [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para soporte, abre un issue en GitHub o contacta al equipo de desarrollo.

---

**Última actualización**: Febrero 2026



---

## 🎯 Características Principales

### ✅ Backend
- Autenticación con Passport.js
- API REST para cálculos
- Base de datos MongoDB
- Panel de administración
- Generación de reportes PDF
- Sesiones seguras

### ✅ Frontend
- Interfaz intuitiva con React
- Formulario de cálculo interactivo
- Historial de cálculos
- Consejos para reducir emisiones
- Descarga de reportes
- Diseño responsive

---

## 👤 Autenticación

Para acceder a la aplicación:

1. Ir a http://localhost:5173/registro para crear una cuenta
2. O usar la opción de inicio de sesión
3. Todos los datos se guardan en MongoDB

---

## 🛠️ Configuración

### Backend (.env)
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/carbon_calculator
SESSION_SECRET=tu-secret-key-aqui
NODE_ENV=development
```

### Frontend
La aplicación se conecta automáticamente al backend en http://localhost:3001

---

## 📊 Flujo de Datos

```
Frontend (React) 
    ↓
    ↓ HTTP/REST API
    ↓
Backend (Express.js)
    ↓
MongoDB (Datos)
```

---

## 🚨 Solución de Problemas

### El frontend no se conecta al backend
- Verifica que el backend esté ejecutándose en puerto 3001
- Revisa la consola del navegador para errores CORS

### MongoDB no está disponible
- Asegúrate de que MongoDB esté ejecutándose
- En Windows: `mongod` en PowerShell
- En Linux/Mac: `brew services start mongodb-community`

### Puerto ya en uso
- Backend: Cambia `PORT` en `.env`
- Frontend: Cambia puerto en `vite.config.js`

---

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `start-servers.bat` | Inicia backend y frontend (Windows) |
| `start-servers.sh` | Inicia backend y frontend (Linux/Mac) |
| `npm run dev` (backend) | Servidor con nodemon |
| `npm run dev` (frontend) | Vite dev server |

---

## 🎨 Diseño

- **Colores primarios**: Púrpura y azul
- **Framework CSS**: Bootstrap 5
- **Iconos**: Font Awesome 6
- **Responsive**: Mobile-first

---

## 📦 Stack Tecnológico

**Frontend:**
- React 18
- Vite
- React Router DOM
- CSS3

**Backend:**
- Express.js
- MongoDB / Mongoose
- Passport.js
- PDFKit
- bcryptjs

---

## 📄 Licencia

MIT

---

**Versión**: 2.0  
**Última actualización**: Febrero 2026
