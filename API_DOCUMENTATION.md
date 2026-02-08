# API Documentation - Carbon Calculator

Documentación completa de los endpoints API de la Calculadora de Huella de Carbono.

## Base URL

```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### Login
- **Método**: POST
- **Endpoint**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "usuario@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "name": "Usuario",
      "role": "user"
    }
  }
  ```

### Register
- **Método**: POST
- **Endpoint**: `/auth/register`
- **Body**:
  ```json
  {
    "email": "nuevo@example.com",
    "password": "password123",
    "name": "Nuevo Usuario"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Usuario creado exitosamente"
  }
  ```

### Logout
- **Método**: POST
- **Endpoint**: `/auth/logout`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Sesión cerrada"
  }
  ```

### Get Current User
- **Método**: GET
- **Endpoint**: `/auth/me`
- **Headers**: Requiere autenticación
- **Response**: 
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "name": "Usuario",
      "role": "user"
    }
  }
  ```

---

## 🌍 Calculate Endpoints

### Calculate Emissions
- **Método**: POST
- **Endpoint**: `/calculate`
- **Headers**: Requiere autenticación
- **Body**:
  ```json
  {
    "transportType": "car",
    "distance": 100,
    "energyUsage": 500,
    "foodType": "meat",
    "wasteGeneration": 50
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "emissions": 125.50,
    "level": "alto",
    "details": {
      "transport": "21.00",
      "energy": "237.50",
      "food": "6.61",
      "waste": "20.00"
    }
  }
  ```

### Get Calculation History
- **Método**: GET
- **Endpoint**: `/calculate/history`
- **Headers**: Requiere autenticación
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Historial de cálculos",
    "history": []
  }
  ```

---

## 👨‍💼 Admin Endpoints

Todos estos endpoints requieren autenticación y rol de administrador.

### Get Statistics
- **Método**: GET
- **Endpoint**: `/admin/stats`
- **Response**: 
  ```json
  {
    "success": true,
    "stats": {
      "totalUsers": 150,
      "totalCalculations": 500,
      "averageEmissions": 25.50,
      "topEmitters": []
    }
  }
  ```

### List Users
- **Método**: GET
- **Endpoint**: `/admin/users`
- **Response**: 
  ```json
  {
    "success": true,
    "users": []
  }
  ```

### Delete User
- **Método**: DELETE
- **Endpoint**: `/admin/users/:id`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Usuario eliminado"
  }
  ```

### List Calculations
- **Método**: GET
- **Endpoint**: `/admin/calculations`
- **Response**: 
  ```json
  {
    "success": true,
    "calculations": []
  }
  ```

---

## 🎯 Factores de Emisión

### Transporte (kg CO2 por km)
- Auto: 0.21
- Bus: 0.089
- Tren: 0.041
- Avión: 0.255

### Energía
- 0.475 kg CO2 por kWh

### Alimentos (kg CO2 por porción)
- Carne: 6.61
- Pollo: 1.26
- Pescado: 1.26
- Lácteos: 1.23
- Verduras: 0.20

### Residuos
- 0.4 kg CO2 por kg

---

## 📊 Niveles de Emisión

| Nivel | Rango (kg CO2) | Color |
|-------|---|---|
| Excelente | 0 - 5 | Verde (#10b981) |
| Bueno | 5 - 15 | Azul (#3b82f6) |
| Promedio | 15 - 30 | Naranja (#f59e0b) |
| Alto | 30 - 50 | Rojo (#ef4444) |
| Muy Alto | > 50 | Púrpura (#8b5cf6) |

---

## ⚠️ Códigos de Error

| Código | Mensaje |
|--------|---------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos de administrador |
| 500 | Internal Server Error - Error del servidor |

---

## 🔄 Flujo de Autenticación

1. Usuario se registra con email, contraseña y nombre
2. Usuario inicia sesión con email y contraseña
3. Backend valida credenciales y crea sesión
4. Cliente mantiene sesión en cookies
5. Todos los endpoints protegidos verifican autenticación
6. Admin tiene acceso a endpoints adicionales

---

## 📝 Notas Importantes

- Todos los endpoints protegidos requieren estar autenticado
- Las sesiones expiran en 7 días
- Las contraseñas se almacenan con hash bcrypt
- El role por defecto es "user", solo administradores tienen "admin"
- Los cálculos se asocian al usuario autenticado
