# ⚡ GUÍA DE INSTALACIÓN RÁPIDA
## Calculadora de Huella de Carbono - Express.js

---

## 🎯 VERSIÓN SIMPLIFICADA CON EXPRESS

Esta es una versión **mucho más simple** que usa Node.js y Express en lugar de Django Python. 

### ✨ Ventajas:
- ✅ **Sin base de datos** que configurar
- ✅ **Menos dependencias** (solo 3 paquetes)
- ✅ **Más rápido** de instalar y ejecutar
- ✅ **Código más simple** y fácil de entender

---

## 📋 REQUISITOS

Solo necesitas:
- **Node.js** (v14 o superior) → [Descargar aquí](https://nodejs.org/)
- Ya viene con **npm** incluido

---

## 🚀 INSTALACIÓN EN 3 PASOS

### Paso 1: Descomprimir
```bash
# Descomprime el archivo ZIP
# Abre la terminal en la carpeta descomprimida
cd carbon-calculator-express
```

### Paso 2: Instalar Dependencias
```bash
npm install
```
Esto instala:
- express (servidor web)
- ejs (plantillas HTML)
- body-parser (procesar formularios)

### Paso 3: Ejecutar
```bash
npm start
```

**¡Listo!** Abre tu navegador en: `http://localhost:3000`

---

## 💻 COMANDOS ÚTILES

```bash
# Iniciar el servidor
npm start

# Modo desarrollo (con auto-reload)
npm run dev

# Cambiar el puerto
PORT=8080 npm start

# Ver versión de Node
node --version

# Ver versión de npm
npm --version
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
carbon-calculator-express/
│
├── 📄 app.js                    # ⭐ Servidor principal (TODO está aquí)
├── 📄 package.json              # Dependencias del proyecto
│
├── 📁 public/                   # Archivos públicos (CSS, imágenes)
│   └── css/
│       └── style.css
│
└── 📁 views/                    # Páginas HTML (plantillas EJS)
    ├── index.ejs                # Página principal
    ├── calculate.ejs            # Formulario
    ├── results.ejs              # Resultados
    ├── history.ejs              # Historial
    ├── tips.ejs                 # Consejos
    └── about.ejs                # Información
```

---

## 🎯 CÓMO FUNCIONA

### 1. El archivo principal es `app.js`

Todo el código del servidor está en un solo archivo:
- Define las rutas (/, /calcular, /resultados, etc.)
- Calcula las emisiones
- Almacena los cálculos en memoria
- Incluye todos los consejos

### 2. Las páginas están en `views/`

Son plantillas EJS (HTML con JavaScript embebido):
- Fáciles de editar
- Similar a HTML normal
- Pueden mostrar datos dinámicos

### 3. Los estilos están en `public/css/`

Un solo archivo CSS con todos los estilos.

---

## 🔧 PERSONALIZACIÓN RÁPIDA

### Cambiar el Puerto

Edita `app.js` línea 5:
```javascript
const PORT = process.env.PORT || 3000;  // Cambia 3000 por el puerto que quieras
```

### Agregar Más Consejos

Edita `app.js` desde la línea 14 (objeto `tips`):
```javascript
const tips = {
  transporte: [
    {
      level: 'promedio',
      title: 'Tu nuevo consejo',
      description: 'Descripción detallada...',
      reduction: 500,  // kg CO₂/año que se ahorra
      difficulty: 'facil'  // facil, medio o dificil
    }
  ]
};
```

### Cambiar Factores de Emisión

Edita `app.js` línea 72 (función `calculateEmissions`):
```javascript
const CAR_FACTOR = 0.21;  // Cambia estos valores
const ELECTRICITY_FACTOR = 0.475;
// etc.
```

---

## 🎨 PÁGINAS DISPONIBLES

Una vez que el servidor está corriendo:

| URL | Página |
|-----|--------|
| `http://localhost:3000/` | Página principal |
| `http://localhost:3000/calcular` | Formulario de cálculo |
| `http://localhost:3000/resultados/1` | Resultados (ejemplo) |
| `http://localhost:3000/historial` | Ver todos los cálculos |
| `http://localhost:3000/consejos` | Lista de consejos |
| `http://localhost:3000/acerca` | Información |

---

## ⚠️ IMPORTANTE: ALMACENAMIENTO

**Los datos se guardan en memoria (RAM)**

Esto significa:
- ✅ No necesitas configurar una base de datos
- ✅ Es súper simple
- ⚠️ **Los datos se BORRAN al reiniciar el servidor**

### Para Datos Permanentes:

Si quieres que los datos persistan, necesitas agregar una base de datos:

**Opción 1: MongoDB (recomendado para Node.js)**
```bash
npm install mongoose
```

**Opción 2: SQLite (archivo local)**
```bash
npm install sqlite3
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module 'express'"
**Solución:** Instala las dependencias
```bash
npm install
```

### Error: "Port 3000 is already in use"
**Solución:** Usa otro puerto
```bash
PORT=8080 npm start
```

### Error: "node: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### La página no carga
**Verificar:**
1. ¿El servidor está corriendo? (debe decir "Servidor corriendo...")
2. ¿Hay errores en la consola?
3. ¿La URL es correcta? (http://localhost:3000)

---

## 📊 COMPARACIÓN CON LA VERSIÓN DJANGO

| Característica | Express (Esta) | Django (Otra) |
|---------------|----------------|---------------|
| **Instalación** | 3 pasos | 7 pasos |
| **Dependencias** | 3 paquetes | 10+ paquetes |
| **Base de datos** | No requiere | Requiere SQLite |
| **Configuración** | Mínima | Extensa |
| **Código** | ~300 líneas | ~1000+ líneas |
| **Archivos** | 12 archivos | 50+ archivos |
| **Tiempo setup** | 2 minutos | 10+ minutos |
| **Curva aprendizaje** | Fácil | Media |

---

## 🚀 DESPLIEGUE FÁCIL

### Heroku (GRATIS)
```bash
# 1. Crear cuenta en heroku.com
# 2. Instalar Heroku CLI
# 3. Ejecutar:
heroku login
heroku create
git push heroku main
```

### Vercel (GRATIS)
```bash
npm install -g vercel
vercel
```

### Render (GRATIS)
1. Conecta tu repositorio GitHub
2. Selecciona Node.js
3. Click en Deploy

---

## 📚 RECURSOS DE APRENDIZAJE

### Express.js
- [Documentación oficial](https://expressjs.com/)
- [Tutorial Express MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

### EJS
- [Documentación EJS](https://ejs.co/)
- [Tutorial EJS](https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)

### Node.js
- [Node.js Docs](https://nodejs.org/en/docs/)
- [Node.js Tutorial](https://www.w3schools.com/nodejs/)

---

## 💡 DIFERENCIAS CLAVE CON DJANGO

### Django (Python):
```python
# models.py - Define modelos de base de datos
# views.py - Lógica de las vistas
# urls.py - Define rutas
# templates/ - Plantillas HTML
# admin.py - Panel de administración
```

### Express (Node.js):
```javascript
// app.js - TODO en un archivo
// - Rutas con app.get()
// - Lógica en las funciones
// - Datos en memoria (arrays)
// views/ - Plantillas EJS
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de empezar, asegúrate de:
- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Proyecto descomprimido
- [ ] Terminal abierta en la carpeta del proyecto
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm start`)
- [ ] Navegador abierto en http://localhost:3000

---

## 🎓 IDEAL PARA:

✅ Principiantes en desarrollo web
✅ Proyectos escolares/universitarios
✅ Prototipos rápidos
✅ Aprender Express y Node.js
✅ Aplicaciones simples sin muchos usuarios

❌ No recomendado para:
- Aplicaciones con miles de usuarios
- Datos que necesitan persistir mucho tiempo
- Proyectos que requieren autenticación compleja

---

## 🌟 PRÓXIMOS PASOS

Una vez que funcione:

1. **Personaliza** los consejos según tu región
2. **Modifica** los factores de emisión
3. **Agrega** más categorías
4. **Cambia** los colores y diseño
5. **Comparte** con amigos y familia

---

**¡Disfruta tu calculadora de huella de carbono! 🌱**

Si tienes problemas, revisa:
- La consola del servidor (donde ejecutaste `npm start`)
- La consola del navegador (F12 → Console)
- El archivo README.md
