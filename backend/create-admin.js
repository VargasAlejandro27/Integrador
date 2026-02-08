require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// === CREAR USUARIO ADMINISTRADOR ===
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'carbon_calculator',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function createAdmin() {
  try {
    const email = 'admin@ecocalc.com';
    const name = 'Administrador';
    const password = 'admin123456';
    
    // Validar que el usuario admin no exista
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('⚠️  El usuario admin ya existe');
      process.exit(0);
    }
    
    // Hashear contraseña con bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertar usuario admin usando stored procedure
      const result = await client.query(
        'SELECT * FROM register_user($1, $2, $3, $4)',
        [email.toLowerCase().trim(), name, passwordHash, 'admin']
      );

      await client.query('COMMIT');

      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email:', result.rows[0].email);
      console.log('🔐 Contraseña: ' + password);
      console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después de tu primer login');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al crear admin:', err);
    process.exit(1);
  }
}

createAdmin();
