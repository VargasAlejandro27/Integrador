# ⚛️ Frontend - React + Vite

Aplicación frontend moderna con React y Vite para calcular y gestionar la huella de carbono.

---

## 🚀 Quick Start

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 📚 Estructura

```
frontend/
├── src/
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entrada de la app
│   ├── styles.css             # Estilos globales
│   ├── auth/
│   │   ├── AuthProvider.jsx   # Contexto de autenticación
│   │   └── RequireAuth.jsx    # Componente protegido
│   ├── pages/
│   │   ├── Home.jsx           # Página de inicio
│   │   ├── Login.jsx          # Iniciar sesión
│   │   ├── Register.jsx       # Crear cuenta
│   │   ├── Calculate.jsx      # Calcular huella
│   │   ├── Results.jsx        # Ver resultados
│   │   ├── History.jsx        # Historial de cálculos
│   │   └── Tips.jsx           # Consejos de reducción
│   ├── utils/
│   │   └── colors.js          # Colores de la app
│   └── views/
│       └── admin-dashboard.ejs # Panel de admin
├── public/css/
│   ├── app.css                # Estilos de la app
│   └── style.css              # Estilos generales
├── vite.config.js             # Configuración de Vite
├── package.json
└── index.html
```

---

## 🎯 Características

✅ Autenticación con sesiones  
✅ Cálculo de huella de carbono interactivo  
✅ Visualización de resultados  
✅ Historial de cálculos  
✅ Consejos para reducir emisiones  
✅ Panel de administración  
✅ Descarga de reportes PDF  
✅ Diseño responsive  

---

## 💻 Scripts

```bash
npm run dev              # Servidor de desarrollo (Vite)
npm run build           # Build para producción
npm run preview         # Previsualizar build de producción
```

---

## 📡 API Connection

La aplicación se conecta al backend en:
```
http://localhost:3001/api/*
```

El backend debe estar ejecutándose para que la aplicación funcione correctamente.

---

## 🔐 Autenticación

- Las rutas protegidas requieren estar autenticado
- Las credenciales se guardan en sesión
- El contexto `AuthProvider` maneja el estado de autenticación

---

## 📦 Dependencias

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1"
}
```

---

**Versión**: 2.0 | React + Vite | 2026
