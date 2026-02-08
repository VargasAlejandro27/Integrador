// utils/emissionCalculator.js
const config = require('../config');

/**
 * Calcula las emisiones de carbono basadas en diferentes factores
 * @param {Object} data - Datos de cálculo
 * @returns {Object} Resultado del cálculo
 */
function calculateEmissions(data) {
  const { transportType, distance, energyUsage, foodType, wasteGeneration } = data;
  
  let emissions = 0;
  const details = {};
  
  // Cálculo de transporte
  if (transportType && distance) {
    const factor = config.emissionFactors.transport[transportType] || 0;
    details.transport = parseFloat((distance * factor).toFixed(2));
    emissions += details.transport;
  } else {
    details.transport = 0;
  }
  
  // Cálculo de energía
  if (energyUsage) {
    details.energy = parseFloat((energyUsage * config.emissionFactors.energy).toFixed(2));
    emissions += details.energy;
  } else {
    details.energy = 0;
  }
  
  // Cálculo de alimentos
  if (foodType) {
    const factor = config.emissionFactors.food[foodType] || 0;
    details.food = parseFloat(factor.toFixed(2));
    emissions += details.food;
  } else {
    details.food = 0;
  }
  
  // Cálculo de residuos
  if (wasteGeneration) {
    details.waste = parseFloat((wasteGeneration * config.emissionFactors.waste).toFixed(2));
    emissions += details.waste;
  } else {
    details.waste = 0;
  }
  
  return {
    total: parseFloat(emissions.toFixed(2)),
    details: details,
    level: getEmissionLevel(emissions),
    color: getEmissionColor(emissions)
  };
}

/**
 * Obtiene el nivel de emisión basado en el total
 * @param {Number} emissions - Total de emisiones
 * @returns {String} Nivel de emisión
 */
function getEmissionLevel(emissions) {
  const levels = config.emissionLevels;
  
  if (emissions >= levels.muy_alto.min) return 'muy_alto';
  if (emissions >= levels.alto.min) return 'alto';
  if (emissions >= levels.promedio.min) return 'promedio';
  if (emissions >= levels.bueno.min) return 'bueno';
  return 'excelente';
}

/**
 * Obtiene el color correspondiente al nivel de emisión
 * @param {Number} emissions - Total de emisiones
 * @returns {String} Color en hex
 */
function getEmissionColor(emissions) {
  const level = getEmissionLevel(emissions);
  return config.emissionLevels[level].color;
}

/**
 * Obtiene consejos basados en el nivel de emisión
 * @param {String} category - Categoría (transport, energy, food)
 * @param {String} level - Nivel de emisión
 * @returns {Array} Array de consejos
 */
function getTips(category, level) {
  const tips = config.tips[category] || [];
  return tips.filter(tip => {
    // Retornar consejos para este nivel o superiores
    const levels = ['excelente', 'bueno', 'promedio', 'alto', 'muy_alto'];
    const currentIndex = levels.indexOf(level);
    const tipIndex = levels.indexOf(tip.level);
    return tipIndex >= currentIndex;
  });
}

module.exports = {
  calculateEmissions,
  getEmissionLevel,
  getEmissionColor,
  getTips
};
