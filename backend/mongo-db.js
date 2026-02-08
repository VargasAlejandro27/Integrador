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
    default: 'Anónimo'
  },
  transportEmissions: Number,
  energyEmissions: Number,
  foodEmissions: Number,
  consumptionEmissions: Number,
  totalEmissions: {
    type: Number,
    required: true
  },
  level: String,
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
