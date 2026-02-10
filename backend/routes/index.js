const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth');
const calculateRoutes = require('./calculate');
const adminRoutes = require('./admin');

// Usar rutas
// Exponer rutas de auth tanto bajo '/auth' como en la raíz para compatibilidad
router.use('/auth', authRoutes);
router.use('/', authRoutes);
router.use('/calculate', calculateRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
