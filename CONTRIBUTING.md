# Guía de Contribución

¡Gracias por tu interés en contribuir a la Calculadora de Huella de Carbono! 

## 📋 Requisitos Previos

- Node.js v14 o superior
- npm v6 o superior
- Git configurado
- Conocimiento básico de Express.js y React

## 🚀 Configuración del Desarrollo

1. **Fork el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/carbon-calculator.git
   cd carbon-calculator
   ```

2. **Instalar dependencias**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. **Iniciar servidores**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 📝 Proceso de Contribución

1. **Crear una rama**
   ```bash
   git checkout -b feature/tu-feature
   # o para bug fixes
   git checkout -b fix/tu-bug
   ```

2. **Hacer cambios**
   - Sigue las convenciones de código existentes
   - Añade comentarios útiles cuando sea necesario
   - Prueba tus cambios localmente

3. **Commit de cambios**
   ```bash
   git add .
   git commit -m "feat: descripción clara de tu cambio"
   ```

   Usa convenciones de commit:
   - `feat:` para nuevas características
   - `fix:` para correcciones
   - `docs:` para documentación
   - `style:` para cambios de estilo (sin cambiar funcionalidad)
   - `refactor:` para refactorización de código
   - `test:` para pruebas

4. **Push a tu fork**
   ```bash
   git push origin feature/tu-feature
   ```

5. **Crear Pull Request**
   - Describe los cambios claramente
   - Referencia issues relacionados
   - Incluye screenshots si es relevante

## 🎨 Convenciones de Código

### Backend (Node.js/Express)
```javascript
// Usa camelCase para variables y funciones
const userId = 123;

// Usa PascalCase para clases
class UserController {
  // ...
}

// Usa const por defecto
const express = require('express');

// Comenta funciones complejas
/**
 * Calcula las emisiones de carbono
 * @param {Object} data - Datos de entrada
 * @returns {Number} Emisiones totales
 */
function calculateEmissions(data) {
  // ...
}
```

### Frontend (React)
```javascript
// Usa PascalCase para componentes
function MyComponent() {
  return <div>...</div>;
}

// Usa camelCase para props y state
const [userData, setUserData] = useState(null);

// Usa useCallback para funciones memorizadas
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

## 🧪 Testing

Antes de hacer commit:
1. Prueba tu código manualmente
2. Verifica que no haya errores en la consola
3. Comprueba que los cambios funcionan en ambos navegadores (Chrome, Firefox)

## 🐛 Reporte de Bugs

Si encuentras un bug:
1. Verifica que no haya sido reportado ya
2. Crea un issue con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Tu entorno (OS, navegador, versión de Node)

## 💡 Sugerencias de Mejora

Para sugerencias:
1. Abre un issue con etiqueta `enhancement`
2. Describe la mejora detalladamente
3. Explica el beneficio

## 📚 Estructura del Proyecto

```
carbon-calculator/
├── backend/
│   ├── routes/          # Rutas API
│   ├── middleware/      # Middlewares
│   ├── utils/           # Funciones utilitarias
│   ├── config.js        # Configuración
│   └── app.js           # App principal
├── frontend/
│   ├── src/
│   │   ├── pages/       # Páginas
│   │   ├── components/  # Componentes
│   │   ├── auth/        # Autenticación
│   │   └── utils/       # Utilidades
│   └── public/          # Archivos estáticos
└── docs/                # Documentación
```

## 🚀 Deploy

- El proyecto se despliega automáticamente en producción cuando se hace merge a `main`
- Siempre prueba tus cambios localmente antes de hacer push

## ❓ Preguntas

Si tienes preguntas:
1. Revisa la documentación existente
2. Busca en issues abiertos
3. Pregunta en una discusión o issue nuevo

## 📄 Licencia

Al contribuir, aceptas que tu código será licenciado bajo la misma licencia que el proyecto (MIT).

¡Gracias por tu contribución! 🎉
