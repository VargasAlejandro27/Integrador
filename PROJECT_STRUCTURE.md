# Estructura del Proyecto

```
carbon-calculator/
│
├── backend/                          # Servidor Express.js
│   ├── routes/                       # Rutas API organizadas
│   │   ├── index.js                 # Rutas principales
│   │   ├── auth.js                  # Autenticación (login, register, logout)
│   │   ├── calculate.js             # Cálculos de emisiones
│   │   └── admin.js                 # Endpoints de administrador
│   ├── middleware/                   # Middlewares personalizados
│   │   ├── errorHandler.js          # Manejo centralizado de errores
│   │   └── authentication.js        # Verificación de autenticación
│   ├── utils/                        # Funciones utilitarias
│   │   ├── emissionCalculator.js    # Lógica de cálculo de emisiones
│   │   └── logger.js                # Sistema de logging
│   ├── views/                        # Templates EJS (servidor renderizado)
│   │   ├── layout.ejs               # Layout principal
│   │   ├── index.ejs                # Página de inicio
│   │   ├── login.ejs                # Formulario de login
│   │   ├── registro.ejs             # Formulario de registro
│   │   ├── calculate.ejs            # Página de cálculo
│   │   ├── results.ejs              # Resultados
│   │   ├── history.ejs              # Historial
│   │   ├── tips.ejs                 # Consejos
│   │   ├── admin-login.ejs          # Login de admin
│   │   └── admin-dashboard.ejs      # Panel de admin
│   ├── public/                       # Archivos estáticos
│   │   └── css/
│   │       ├── app.css              # Estilos de la app
│   │       └── style.css            # Estilos adicionales
│   ├── app.js                        # Configuración principal de Express
│   ├── auth.js                       # Módulo de autenticación
│   ├── db.js                         # Conexión a PostgreSQL
│   ├── mongo-db.js                  # Conexión a MongoDB
│   ├── create-admin.js              # Script para crear admin
│   ├── config.js                    # Configuración centralizada (NUEVO)
│   ├── package.json                 # Dependencias
│   ├── .env.example                 # Variables de entorno ejemplo
│   ├── DOCUMENTACION_COMPLETA.md    # Docs del backend
│   ├── INICIO_AQUI.md               # Guía de inicio
│   └── README.md                    # README del backend
│
├── frontend/                         # Aplicación React + Vite
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   │   ├── Header.jsx           # Encabezado
│   │   │   ├── Footer.jsx           # Pie de página
│   │   │   ├── Navigation.jsx       # Navegación
│   │   │   └── ...
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.jsx             # Página de inicio
│   │   │   ├── Login.jsx            # Login
│   │   │   ├── Register.jsx         # Registro
│   │   │   ├── Calculate.jsx        # Cálculo
│   │   │   ├── Results.jsx          # Resultados
│   │   │   ├── History.jsx          # Historial
│   │   │   └── Tips.jsx             # Consejos
│   │   ├── auth/                    # Lógica de autenticación
│   │   │   ├── AuthProvider.jsx     # Context de autenticación
│   │   │   ├── RequireAuth.jsx      # Guard de rutas
│   │   │   └── useAuth.js           # Hook de autenticación
│   │   ├── utils/                   # Funciones utilitarias
│   │   │   ├── colors.js            # Paleta de colores
│   │   │   ├── api.js               # Cliente HTTP
│   │   │   └── validators.js        # Validadores
│   │   ├── App.jsx                  # Componente principal
│   │   ├── main.jsx                 # Punto de entrada
│   │   └── styles.css               # Estilos globales
│   ├── public/
│   │   ├── css/                     # Estilos adicionales
│   │   │   ├── app.css
│   │   │   └── style.css
│   │   ├── images/                  # Imágenes
│   │   └── favicon.ico              # Favicon
│   ├── package.json
│   ├── vite.config.js               # Configuración de Vite
│   ├── index.html                   # HTML principal
│   └── README.md                    # README del frontend
│
├── docs/                            # Documentación general (NUEVO)
│   ├── ARCHITECTURE.md              # Arquitectura del proyecto
│   ├── DEPLOYMENT.md                # Guía de deployment
│   └── TROUBLESHOOTING.md           # Solución de problemas
│
├── views/                           # Templates adicionales
│   └── admin-dashboard.ejs          # Dashboard de admin
│
├── public/                          # Assets estáticos raíz
│   └── ...
│
├── start-servers.bat                # Script para iniciar (Windows) (NUEVO)
├── start-servers.sh                 # Script para iniciar (Linux/Mac) (NUEVO)
├── .gitignore                       # Archivos ignorados en Git (ACTUALIZADO)
├── .env.example                     # Variables de entorno raíz (NUEVO)
├── .github/                         # Configuración de GitHub
│   └── workflows/                   # Automatizaciones
├── API_DOCUMENTATION.md             # Documentación API (NUEVO)
├── CONTRIBUTING.md                  # Guía de contribución (NUEVO)
├── README.md                        # README principal (ACTUALIZADO)
├── package.json                     # Dependencies raíz (opcional)
└── docker-compose.yml               # Docker (opcional)
```

## 📂 Cambios Recientes

### Archivos Nuevos (Integración Mejorada)
- ✅ `backend/routes/` - Rutas organizadas por módulo
- ✅ `backend/middleware/` - Middlewares personalizados
- ✅ `backend/utils/emissionCalculator.js` - Lógica de cálculos
- ✅ `backend/config.js` - Configuración centralizada
- ✅ `start-servers.bat` - Script automático (Windows)
- ✅ `start-servers.sh` - Script automático (Linux/Mac)
- ✅ `.env.example` - Variables de entorno raíz
- ✅ `API_DOCUMENTATION.md` - Documentación API completa
- ✅ `CONTRIBUTING.md` - Guía de contribución
- ✅ `PROJECT_STRUCTURE.md` - Este archivo

### Archivos Actualizados
- ✅ `.gitignore` - Mejorado
- ✅ `README.md` - Documentación completa

## 🎯 Buenas Prácticas

### Backend
1. Las rutas están organizadas por funcionalidad
2. Middleware centralizado para errores y autenticación
3. Configuración en un archivo único (`config.js`)
4. Utilidades reutilizables en `utils/`
5. Validación de entrada en cada endpoint

### Frontend
1. Componentes pequeños y reutilizables
2. Context para estado global (autenticación)
3. Hooks personalizados para lógica
4. Separación de estilos por componente
5. Utilidades centralizadas

## 📊 Integración Backend-Frontend

```
Frontend (React/Vite)
    ↓
    ↓ HTTP/REST API (JSON)
    ↓
Backend (Express.js)
    ↓
    ↓ Query/Commands
    ↓
Base de Datos
(PostgreSQL o MongoDB)
```

## 🔄 Flujo de Datos

1. **Usuario interactúa** con la UI (React)
2. **Frontend realiza request** a `/api/...` (POST, GET, etc.)
3. **Middleware de autenticación** valida la sesión
4. **Route handler** procesa la solicitud
5. **Utilidades** realizan la lógica (e.g., cálculos)
6. **Base de datos** se consulta/actualiza si es necesario
7. **Respuesta JSON** se envía al frontend
8. **Frontend actualiza** el estado y la UI

## 🚀 Próximas Mejoras

- [ ] Añadir tests automatizados
- [ ] Implementar WebSockets para actualización real-time
- [ ] Añadir gráficos interactivos
- [ ] Integrar analítica
- [ ] Añadir notificaciones por email
- [ ] Dockerizar la aplicación
- [ ] Implementar CI/CD
