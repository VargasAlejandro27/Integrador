const express = require('express');
const router = express.Router();

// Middleware de autenticación y autorización
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'No autenticado' });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Acceso denegado. Solo administradores' });
};

// GET /api/admin/stats - Obtener estadísticas
router.get('/stats', isAdmin, async (req, res) => {
  try {
    // TODO: Implementar estadísticas desde la BD
    res.json({
      success: true,
      stats: {
        totalUsers: 0,
        totalCalculations: 0,
        averageEmissions: 0,
        topEmitters: []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users - Listar usuarios
router.get('/users', isAdmin, async (req, res) => {
  try {
    // TODO: Implementar listado de usuarios desde la BD
    res.json({
      success: true,
      users: []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id - Eliminar usuario
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    // TODO: Implementar eliminación de usuario en la BD
    res.json({
      success: true,
      message: `Usuario ${userId} eliminado`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/calculations - Listar cálculos
router.get('/calculations', isAdmin, async (req, res) => {
  try {
    // TODO: Implementar listado de cálculos desde la BD
    res.json({
      success: true,
      calculations: []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
