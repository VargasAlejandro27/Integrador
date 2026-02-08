// config.js - Configuración centralizada
require('dotenv').config();

module.exports = {
  // Servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base de datos
  database: {
    // PostgreSQL
    postgres: {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'carbon_calculator',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    },
    // MongoDB
    mongodb: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/carbon_calculator'
    }
  },
  
  // Sesiones
  session: {
    secret: process.env.SESSION_SECRET || 'ecocalc-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    }
  },
  
  // Factores de emisión (kg CO2)
  emissionFactors: {
    transport: {
      car: 0.21,        // kg CO2 por km
      bus: 0.089,       // kg CO2 por km
      train: 0.041,     // kg CO2 por km
      airplane: 0.255   // kg CO2 por km
    },
    energy: 0.475,      // kg CO2 por kWh
    food: {
      meat: 6.61,       // kg CO2 por porción
      poultry: 1.26,    // kg CO2 por porción
      fish: 1.26,       // kg CO2 por porción
      dairy: 1.23,      // kg CO2 por porción
      vegetables: 0.20  // kg CO2 por porción
    },
    waste: 0.4          // kg CO2 por kg de residuos
  },
  
  // Niveles de emisión
  emissionLevels: {
    excelente: { min: 0, max: 5, color: '#10b981' },
    bueno: { min: 5, max: 15, color: '#3b82f6' },
    promedio: { min: 15, max: 30, color: '#f59e0b' },
    alto: { min: 30, max: 50, color: '#ef4444' },
    muy_alto: { min: 50, max: Infinity, color: '#8b5cf6' }
  },
  
  // Consejos según nivel
  tips: {
    transporte: [
      { level: 'muy_alto', title: 'Usa transporte público', description: 'Cambiar del auto al transporte público reduce tus emisiones hasta en un 80%.', reduction: 2000 },
      { level: 'alto', title: 'Considera un vehículo eléctrico', description: 'Los vehículos eléctricos reducen las emisiones de transporte hasta en un 90%.', reduction: 1500 }
    ],
    energia: [
      { level: 'alto', title: 'Usa energía renovable', description: 'Cambiar a energía solar o eólica puede reducir tus emisiones de energía en un 100%.', reduction: 1000 }
    ],
    alimentos: [
      { level: 'alto', title: 'Reduce consumo de carne', description: 'La carne tiene la huella más alta. Cambiar a vegetarianismo puede reducir tus emisiones en un 50%.', reduction: 800 }
    ]
  }
};
