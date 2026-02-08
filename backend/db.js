const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'carbon_calculator',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// === CONFIGURACIÓN DE POSTGRESQL ===
// Crear tablas si no existen
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Tabla de usuarios con roles y timestamps
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Índices para optimizar búsquedas frecuentes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    
    console.log('✅ Base de datos PostgreSQL inicializada correctamente');
    client.release();
  } catch (err) {
    console.error('❌ Error al inicializar PostgreSQL:', err);
  }
}

module.exports = {
  pool,
  initializeDatabase,
  query: (text, params) => pool.query(text, params),
};
