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
  let client;
  try {
    client = await pool.connect();

    await client.query('BEGIN');

    // Tabla de usuarios con roles y timestamps + restricciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_users_email_format CHECK (
          email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'
        ),
        CONSTRAINT chk_users_name_length CHECK (char_length(name) >= 2)
      );
    `);

    // Índices para optimizar búsquedas frecuentes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Tabla de auditoría
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id BIGSERIAL PRIMARY KEY,
        table_name TEXT NOT NULL,
        operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
        record_id INTEGER,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        changed_by TEXT DEFAULT current_user,
        old_data JSONB,
        new_data JSONB
      );
    `);

    // Función para actualizar updated_at automáticamente
    await client.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger updated_at
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_set_updated_at'
        ) THEN
          CREATE TRIGGER trg_users_set_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END $$;
    `);

    // Función de auditoría
    await client.query(`
      CREATE OR REPLACE FUNCTION audit_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'DELETE') THEN
          INSERT INTO audit_log(table_name, operation, record_id, old_data)
          VALUES (TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD));
          RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO audit_log(table_name, operation, record_id, old_data, new_data)
          VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
          RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
          INSERT INTO audit_log(table_name, operation, record_id, new_data)
          VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(NEW));
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger de auditoría
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_audit'
        ) THEN
          CREATE TRIGGER trg_users_audit
          AFTER INSERT OR UPDATE OR DELETE ON users
          FOR EACH ROW EXECUTE FUNCTION audit_trigger();
        END IF;
      END $$;
    `);

    // Stored procedure: registrar usuario
    await client.query(`
      CREATE OR REPLACE FUNCTION register_user(
        p_email TEXT,
        p_name TEXT,
        p_password_hash TEXT,
        p_role TEXT DEFAULT 'user'
      )
      RETURNS TABLE (id INTEGER, email TEXT, name TEXT, role TEXT) AS $$
      BEGIN
        RETURN QUERY
        INSERT INTO users (email, name, password_hash, role)
        VALUES (lower(trim(p_email)), trim(p_name), p_password_hash, p_role)
        RETURNING users.id, users.email, users.name, users.role;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Stored procedure: actualizar perfil
    await client.query(`
      CREATE OR REPLACE FUNCTION update_user_profile(
        p_user_id INTEGER,
        p_name TEXT,
        p_email TEXT
      )
      RETURNS TABLE (id INTEGER, email TEXT, name TEXT, role TEXT) AS $$
      BEGIN
        RETURN QUERY
        UPDATE users
        SET name = trim(p_name), email = lower(trim(p_email))
        WHERE id = p_user_id
        RETURNING users.id, users.email, users.name, users.role;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Vistas para reportes
    await client.query(`
      CREATE OR REPLACE VIEW v_user_role_counts AS
      SELECT role, COUNT(*)::INT AS total_users
      FROM users
      GROUP BY role;
    `);

    await client.query(`
      CREATE OR REPLACE VIEW v_user_activity_summary AS
      SELECT
        u.id AS user_id,
        u.email,
        u.name,
        COUNT(a.id)::INT AS total_changes,
        MAX(a.changed_at) AS last_change
      FROM users u
      LEFT JOIN audit_log a
        ON a.table_name = 'users' AND a.record_id = u.id
      GROUP BY u.id, u.email, u.name;
    `);

    await client.query('COMMIT');

    console.log('✅ Base de datos PostgreSQL inicializada correctamente');
  } catch (err) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('❌ Error en rollback de PostgreSQL:', rollbackErr);
      }
    }
    console.error('❌ Error al inicializar PostgreSQL:', err);
  } finally {
    if (client) client.release();
  }
}

module.exports = {
  pool,
  initializeDatabase,
  query: (text, params) => pool.query(text, params),
};
