const express = require('express');
const router = express.Router();
const auth = require('../auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    const user = await auth.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    const isValid = await auth.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        } 
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Crear usuario
    const result = await auth.createUser(email, password, name);
    
    // Verificar si result es un objeto válido con error
    if (result && typeof result === 'object' && result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    // Si llegamos aquí, el usuario fue creado exitosamente
    if (!result) {
      return res.status(500).json({ error: 'Error al procesar el registro' });
    }
    
    res.json({ success: true, message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: err.message || 'Error al crear usuario' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  res.json({ 
    success: true, 
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

module.exports = router;
