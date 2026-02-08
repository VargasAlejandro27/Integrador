const bcrypt = require('bcryptjs');
const db = require('./db');
const { Calculation } = require('./mongo-db');

// === REGISTRAR Y AUTENTICAR USUARIOS EN POSTGRESQL ===
const normalizeEmail = (email) => (email || '').trim().toLowerCase();

async function registerUser(email, name, password, role = 'user') {
  let client;
  try {
    // Verificar si el usuario ya existe
    const normalizedEmail = normalizeEmail(email);
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (userExists.rows.length > 0) {
      throw new Error('El correo ya está registrado');
    }
    
    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insertar nuevo usuario usando stored procedure + transacción
    client = await db.pool.connect();
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT * FROM register_user($1, $2, $3, $4)',
      [normalizedEmail, name, passwordHash, role]
    );

    await client.query('COMMIT');

    return result.rows[0];
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (client) client.release();
  }
}

// Obtener usuario por email
async function getUserByEmail(email) {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [normalizeEmail(email)]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

// Obtener usuario por ID
async function getUserById(id) {
  try {
    const result = await db.query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

// Verificar contraseña
async function verifyPassword(password, passwordHash) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (err) {
    throw err;
  }
}

// === GUARDAR Y OBTENER CÁLCULOS DE MONGODB ===
async function saveCalculation(userId, name, emissions, data) {
  try {
    const calculation = new Calculation({
      userId: userId,
      name: name || 'Anónimo',
      transportEmissions: emissions.transport,
      energyEmissions: emissions.energy,
      foodEmissions: emissions.food,
      consumptionEmissions: emissions.consumption,
      totalEmissions: emissions.total,
      level: emissions.level,
      data: data
    });
    
    await calculation.save();
    console.log('💾 MongoDB - Calculation guardado con ID:', calculation._id.toString());
    return { id: calculation._id.toString() };
  } catch (err) {
    console.error('❌ Error al guardar en MongoDB:', err);
    throw err;
  }
}

// Obtener cálculos del usuario desde MongoDB
async function getUserCalculations(userId) {
  try {
    const calculations = await Calculation.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
    return calculations;
  } catch (err) {
    throw err;
  }
}

// Obtener un cálculo específico desde MongoDB
async function getCalculation(calculationId, userId) {
  try {
    const mongoose = require('mongoose');
    
    // Convertir el ID a ObjectId si es necesario
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(calculationId);
    } catch (e) {
      console.error('ID de cálculo inválido:', calculationId);
      return null; // ID inválido
    }
    
    const calculation = await Calculation.findOne({ _id: objectId, userId: userId }).lean();
    return calculation;
  } catch (err) {
    throw err;
  }
}

// Obtener todos los usuarios (solo para admin)
async function getAllUsers() {
  try {
    const result = await db.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (err) {
    throw err;
  }
}

// === OPERACIONES DE ADMINISTRADOR ===
async function getGlobalStats() {
  try {
    const stats = {};
    
    // Total de usuarios
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    stats.totalUsers = parseInt(usersResult.rows[0].count);
    
    // Total de cálculos desde MongoDB
    stats.totalCalculations = await Calculation.countDocuments();
    
    // Emisión promedio desde MongoDB
    const aggregation = await Calculation.aggregate([
      { $group: { _id: null, average: { $avg: '$totalEmissions' } } }
    ]);
    stats.averageEmissions = aggregation.length > 0 ? Math.round(aggregation[0].average) : 0;
    
    // Cálculos por nivel desde MongoDB
    const levelAggregation = await Calculation.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    stats.byLevel = {};
    levelAggregation.forEach(item => {
      stats.byLevel[item._id] = item.count;
    });
    
    return stats;
  } catch (err) {
    throw err;
  }
}

// Obtener cálculos de todos los usuarios (para admin)
async function getAllCalculations() {
  try {
    const calculations = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    
    // Enriquecer con información del usuario
    const enriched = await Promise.all(calculations.map(async (calc) => {
      const user = await getUserById(calc.userId);
      return {
        ...calc,
        user_name: user ? user.name : 'Desconocido',
        email: user ? user.email : 'N/A'
      };
    }));
    
    return enriched;
  } catch (err) {
    throw err;
  }
}

async function updateUserRole(userId, newRole) {
  let client;
  try {
    client = await db.pool.connect();
    await client.query('BEGIN');

    const result = await client.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, name, role',
      [newRole, userId]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (client) client.release();
  }
}

async function updateUser(userId, name, email) {
  let client;
  try {
    client = await db.pool.connect();
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT * FROM update_user_profile($1, $2, $3)',
      [userId, name, email]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (client) client.release();
  }
}

async function deleteCalculation(calculationId) {
  try {
    await Calculation.findByIdAndDelete(calculationId);
    return true;
  } catch (err) {
    throw err;
  }
}

async function updateCalculationName(userId, calculationId, name) {
  try {
    const updated = await Calculation.findOneAndUpdate(
      { _id: calculationId, userId: userId },
      { $set: { name: name, updatedAt: new Date() } },
      { new: true }
    ).lean();

    return updated;
  } catch (err) {
    throw err;
  }
}

async function deleteUserCalculation(userId, calculationId) {
  try {
    const result = await Calculation.findOneAndDelete({ _id: calculationId, userId: userId });
    return !!result;
  } catch (err) {
    throw err;
  }
}

async function deleteUser(userId) {
  try {
    // Eliminar todos sus cálculos en MongoDB
    await Calculation.deleteMany({ userId: userId });
    // Eliminar el usuario en PostgreSQL
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
  saveCalculation,
  getUserCalculations,
  getCalculation,
  getAllUsers,
  getGlobalStats,
  getAllCalculations,
  updateUserRole,
  updateUser,
  updateCalculationName,
  deleteUserCalculation,
  deleteCalculation,
  deleteUser
};
