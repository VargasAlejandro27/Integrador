const express = require('express');
const router = express.Router();

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'No autenticado' });
};

// POST /api/calculate - Calcular huella de carbono
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { transportType, distance, energyUsage, foodType, wasteGeneration } = req.body;
    
    let emissions = 0;
    
    // Cálculo de transporte (km * factor de emisión)
    if (transportType && distance) {
      const factors = {
        car: 0.21,        // kg CO2 por km
        bus: 0.089,       // kg CO2 por km
        train: 0.041,     // kg CO2 por km
        airplane: 0.255   // kg CO2 por km
      };
      emissions += (distance * (factors[transportType] || 0));
    }
    
    // Cálculo de energía (kWh * factor de emisión)
    if (energyUsage) {
      emissions += (energyUsage * 0.475);  // kg CO2 por kWh
    }
    
    // Cálculo de alimentos
    if (foodType) {
      const foodFactors = {
        meat: 6.61,       // kg CO2 por porción
        poultry: 1.26,    // kg CO2 por porción
        fish: 1.26,       // kg CO2 por porción
        dairy: 1.23,      // kg CO2 por porción
        vegetables: 0.20  // kg CO2 por porción
      };
      emissions += (foodFactors[foodType] || 0);
    }
    
    // Cálculo de residuos
    if (wasteGeneration) {
      emissions += (wasteGeneration * 0.4);  // kg CO2 por kg de residuos
    }
    
    // Categorizar nivel
    let level = 'excelente';
    if (emissions > 50) level = 'muy_alto';
    else if (emissions > 30) level = 'alto';
    else if (emissions > 15) level = 'promedio';
    else if (emissions > 5) level = 'bueno';
    
    // Guardar cálculo en base de datos (opcional)
    // await saveCalculation(req.user.id, emissions, level);
    
    res.json({
      success: true,
      emissions: parseFloat(emissions.toFixed(2)),
      level: level,
      details: {
        transport: transportType ? (distance * (factors[transportType] || 0)).toFixed(2) : 0,
        energy: energyUsage ? (energyUsage * 0.475).toFixed(2) : 0,
        food: foodType ? (foodFactors[foodType] || 0).toFixed(2) : 0,
        waste: wasteGeneration ? (wasteGeneration * 0.4).toFixed(2) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/calculate/history - Obtener historial de cálculos
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    // TODO: Implementar obtención del historial desde la BD
    res.json({ 
      success: true, 
      message: 'Historial de cálculos',
      history: [] 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
