const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth');
const calculateRoutes = require('./calculate');
const adminRoutes = require('./admin');

// Usar rutas
router.use('/auth', authRoutes);
router.use('/calculate', calculateRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
