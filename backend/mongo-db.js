const mongoose = require('mongoose');

// Configuración de conexión a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/carbon_calculator';

// === CONFIGURACIÓN DE MONGODB ===
// Esquema de cálculos con campos para análisis de emisiones
const calculationSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'Anónimo',
    trim: true,
    maxlength: 120
  },
  transportEmissions: { type: Number, min: 0, default: 0 },
  energyEmissions: { type: Number, min: 0, default: 0 },
  foodEmissions: { type: Number, min: 0, default: 0 },
  consumptionEmissions: { type: Number, min: 0, default: 0 },
  totalEmissions: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: String,
    enum: ['excelente', 'bueno', 'promedio', 'alto', 'muy_alto']
  },
  data: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Calculation = mongoose.model('Calculation', calculationSchema);

// === CONECTAR A MONGODB ===
async function connectMongoDB() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conexión a MongoDB establecida correctamente');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    throw err;
  }
}

module.exports = {
  connectMongoDB,
  Calculation
};
