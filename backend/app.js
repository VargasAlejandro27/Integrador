require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const { connectMongoDB } = require('./mongo-db');
const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecocalc-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// Configuración de Passport para autenticación
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await auth.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    
    const isValid = await auth.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    
    return done(null, { id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await auth.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === MIDDLEWARE DE AUTENTICACIÓN ===
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Acceso denegado. Solo administradores pueden acceder.');
};

const tips = {
  transporte: [
    {
      level: 'muy_alto',
      title: 'Usa transporte público',
      description: 'Cambiar del auto al transporte público reduce tus emisiones hasta en un 80%.',
      reduction: 2000,
      difficulty: 'medio'
    },
    {
      level: 'alto',
      title: 'Considera un vehículo eléctrico',
      description: 'Los vehículos eléctricos producen significativamente menos emisiones.',
      reduction: 1800,
      difficulty: 'dificil'
    },
    {
      level: 'promedio',
      title: 'Usa bicicleta o camina',
      description: 'Para distancias cortas (< 5km), usa bicicleta o camina.',
      reduction: 800,
      difficulty: 'facil'
    }
  ],
  energia: [
    {
      level: 'muy_alto',
      title: 'Cambia a energías renovables',
      description: 'Instala paneles solares o contrata energía 100% renovable.',
      reduction: 2500,
      difficulty: 'dificil'
    },
    {
      level: 'promedio',
      title: 'Reemplaza bombillas con LED',
      description: 'Las bombillas LED consumen 75% menos energía.',
      reduction: 300,
      difficulty: 'facil'
    },
    {
      level: 'bueno',
      title: 'Desconecta aparatos en standby',
      description: 'Usa regletas con interruptor para apagar aparatos completamente.',
      reduction: 200,
      difficulty: 'facil'
    }
  ],
  alimentacion: [
    {
      level: 'muy_alto',
      title: 'Reduce el consumo de carne roja',
      description: 'La carne roja genera 10-40 veces más emisiones que las verduras.',
      reduction: 1500,
      difficulty: 'medio'
    },
    {
      level: 'alto',
      title: 'Un día sin carne por semana',
      description: 'Implementar "Lunes sin carne" reduce significativamente tu huella.',
      reduction: 500,
      difficulty: 'facil'
    },
    {
      level: 'promedio',
      title: 'Compra productos locales',
      description: 'Los alimentos locales requieren menos transporte.',
      reduction: 300,
      difficulty: 'facil'
    }
  ],
  consumo: [
    {
      level: 'muy_alto',
      title: 'Adopta el minimalismo',
      description: 'Compra solo lo necesario. Cada producto tiene una huella.',
      reduction: 1000,
      difficulty: 'medio'
    },
    {
      level: 'promedio',
      title: 'Repara en lugar de reemplazar',
      description: 'Intenta reparar ropa, electrónicos y muebles antes de tirarlos.',
      reduction: 500,
      difficulty: 'medio'
    },
    {
      level: 'bueno',
      title: 'Implementa las 3R',
      description: 'Reduce, Reutiliza, Recicla - en ese orden de prioridad.',
      reduction: 400,
      difficulty: 'facil'
    }
  ]
};

// === CÁLCULO DE EMISIONES CO2 ===
function calculateEmissions(data) {
  const CAR_FACTOR = 0.21;
  const PUBLIC_TRANSPORT_FACTOR = 0.089;
  const FLIGHT_FACTOR = 1100;
  const ELECTRICITY_FACTOR = 0.475;
  const GAS_FACTOR = 2.03;

  const DIET_EMISSIONS = {
    carnivoro: 3300,
    moderado: 2200,
    vegetariano: 1700,
    vegano: 1500
  };

  const SHOPPING_FACTOR = 150;
  const RECYCLING_REDUCTION = 0.1;

  const transportEmissions = 
    parseFloat(data.carKm || 0) * 52 * CAR_FACTOR +
    parseFloat(data.publicTransportHours || 0) * 52 * PUBLIC_TRANSPORT_FACTOR +
    parseInt(data.flights || 0) * FLIGHT_FACTOR;

  const energyEmissions = 
    parseFloat(data.electricity || 0) * 12 * ELECTRICITY_FACTOR +
    parseFloat(data.gas || 0) * 12 * GAS_FACTOR;

  const foodEmissions = DIET_EMISSIONS[data.diet] || 2200;

  let consumptionEmissions = parseInt(data.shopping || 0) * 12 * SHOPPING_FACTOR;
  if (data.recycles === 'on') {
    consumptionEmissions *= (1 - RECYCLING_REDUCTION);
  }

  const totalEmissions = transportEmissions + energyEmissions + foodEmissions + consumptionEmissions;

  let level;
  if (totalEmissions < 4000) level = 'excelente';
  else if (totalEmissions < 6000) level = 'bueno';
  else if (totalEmissions < 10000) level = 'promedio';
  else if (totalEmissions < 15000) level = 'alto';
  else level = 'muy_alto';

  return {
    transport: Math.round(transportEmissions),
    energy: Math.round(energyEmissions),
    food: Math.round(foodEmissions),
    consumption: Math.round(consumptionEmissions),
    total: Math.round(totalEmissions),
    level: level
  };
}

function getTipsForLevel(level) {
  const relevantTips = {};
  
  for (const category in tips) {
    relevantTips[category] = tips[category].filter(tip => 
      tip.level === level || tip.level === 'promedio'
    ).slice(0, 3);
  }
  
  return relevantTips;
}

// === RUTAS DE AUTENTICACIÓN ===
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', { message: req.query.message });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?message=Correo o contraseña incorrectos'
}));

app.get('/registro', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('registro', { message: null });
});

app.post('/registro', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.render('registro', { message: 'Todos los campos son requeridos' });
    }
    
    if (password !== confirmPassword) {
      return res.render('registro', { message: 'Las contraseñas no coinciden' });
    }
    
    if (password.length < 6) {
      return res.render('registro', { message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    const user = await auth.registerUser(email, name, password);
    
    req.logIn(user, (err) => {
      if (err) {
        return res.render('registro', { message: 'Error al crear la cuenta' });
      }
      res.redirect('/');
    });
  } catch (err) {
    const message = err.message === 'El correo ya está registrado' ? 
      'Este correo ya está registrado' : 
      'Error al crear la cuenta';
    res.render('registro', { message });
  }
});

app.get('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) return res.send('Error al cerrar sesión');
    res.redirect('/login');
  });
});

// ========== RUTAS DE ADMINISTRADOR ==========

// Login de Admin
app.get('/admin/login', (req, res) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin-login', { message: req.query.message });
});

app.post('/admin/login', passport.authenticate('local', {
  failureRedirect: '/admin/login?message=Correo o contraseña incorrectos o no eres administrador'
}), (req, res) => {
  // Verificar que sea admin
  if (req.user.role !== 'admin') {
    req.logOut((err) => {
      res.redirect('/admin/login?message=Solo administradores pueden acceder');
    });
  } else {
    res.redirect('/admin/dashboard');
  }
});

// Dashboard de Admin
app.get('/admin/dashboard', isAdmin, async (req, res) => {
  try {
    const stats = await auth.getGlobalStats();
    const users = await auth.getAllUsers();
    const calculations = await auth.getAllCalculations();
    
    res.render('admin-dashboard', {
      stats,
      users,
      calculations,
      user: req.user,
      currentUserId: req.user.id
    });
  } catch (err) {
    console.error('Error en admin dashboard:', err);
    res.status(500).send('Error al cargar el dashboard');
  }
});

// Logout de Admin
app.get('/admin/logout', (req, res) => {
  req.logOut((err) => {
    if (err) return res.send('Error al cerrar sesión');
    res.redirect('/admin/login');
  });
});

// ========== RUTAS API PARA ADMIN ==========

// Asignar/cambiar rol de usuario
app.put('/admin/api/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    const updatedUser = await auth.updateUserRole(parseInt(req.params.id), role);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error al actualizar rol:', err);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// Editar usuario
app.put('/admin/api/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email requeridos' });
    }
    
    const updatedUser = await auth.updateUser(parseInt(req.params.id), name, email);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error al editar usuario:', err);
    res.status(500).json({ error: 'Error al editar usuario' });
  }
});

// Eliminar usuario
app.delete('/admin/api/users/:id', isAdmin, async (req, res) => {
  try {
    // Evitar que se elimine a sí mismo
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    
    await auth.deleteUser(parseInt(req.params.id));
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Eliminar cálculo
app.delete('/admin/api/calculations/:id', isAdmin, async (req, res) => {
  try {
    await auth.deleteCalculation(parseInt(req.params.id));
    res.json({ success: true, message: 'Cálculo eliminado' });
  } catch (err) {
    console.error('Error al eliminar cálculo:', err);
    res.status(500).json({ error: 'Error al eliminar cálculo' });
  }
});

// Rutas principales
app.get('/', (req, res) => {
  // Si el usuario está autenticado y es admin, redirigir al dashboard
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('index', { user: req.user });
});

app.get('/calcular', isAuthenticated, (req, res) => {
  res.render('calculate', { user: req.user });
});

app.post('/calcular', isAuthenticated, async (req, res) => {
  const emissions = calculateEmissions(req.body);
  
  try {
    // Preparar solo los datos necesarios para guardar
    const calculationData = {
      carKm: req.body.carKm,
      publicTransportHours: req.body.publicTransportHours,
      flights: req.body.flights,
      electricity: req.body.electricity,
      gas: req.body.gas,
      diet: req.body.diet,
      shopping: req.body.shopping,
      recycles: req.body.recycles
    };
    
    const result = await auth.saveCalculation(req.user.id, req.body.name || req.user.name, emissions, calculationData);
    
    console.log('📊 Cálculo guardado:', result);
    
    if (!result || !result.id) {
      console.error('Error: No se obtuvo ID de cálculo', result);
      return res.status(500).send('Error al guardar el cálculo');
    }
    
    console.log('📍 Redirigiendo a: /resultados/' + result.id);
    return res.redirect(`/resultados/${result.id}`);
  } catch (err) {
    console.error('Error al guardar cálculo:', err);
    return res.status(500).send('Error al guardar el cálculo: ' + err.message);
  }
});

app.get('/resultados/:id', isAuthenticated, async (req, res) => {
  try {
    console.log('🔍 Buscando cálculo ID:', req.params.id, 'Usuario ID:', req.user.id);
    
    const calculation = await auth.getCalculation(req.params.id, req.user.id);
    
    console.log('📦 Cálculo encontrado:', calculation ? 'Sí' : 'No');
    
    if (!calculation) {
      console.log('❌ Cálculo no encontrado');
      return res.redirect('/');
    }
    
    const emissions = {
      transport: calculation.transportEmissions,
      energy: calculation.energyEmissions,
      food: calculation.foodEmissions,
      consumption: calculation.consumptionEmissions,
      total: calculation.totalEmissions,
      level: calculation.level
    };
    
    calculation.emissions = emissions;
    
    // Los datos ya están en formato JSON, no necesitan parseo
    if (!calculation.data) {
      calculation.data = {};
    }
    
    const relevantTips = getTipsForLevel(calculation.emissions.level);
    
    const total = calculation.emissions.total;
    const percentages = {
      transport: ((calculation.emissions.transport / total) * 100).toFixed(1),
      energy: ((calculation.emissions.energy / total) * 100).toFixed(1),
      food: ((calculation.emissions.food / total) * 100).toFixed(1),
      consumption: ((calculation.emissions.consumption / total) * 100).toFixed(1)
    };
    
    const worldAverage = 8000;
    const countryAverage = 6000;
    const comparisons = {
      world: (((total - worldAverage) / worldAverage) * 100).toFixed(1),
      country: (((total - countryAverage) / countryAverage) * 100).toFixed(1)
    };
    
    res.render('results', {
      calculation,
      tips: relevantTips,
      percentages,
      comparisons,
      worldAverage,
      countryAverage,
      user: req.user
    });
  } catch (err) {
    console.error('Error al obtener resultados:', err);
    res.redirect('/');
  }
});

app.get('/historial', isAuthenticated, async (req, res) => {
  try {
    const userCalculations = await auth.getUserCalculations(req.user.id);
    
    let stats = null;
    if (userCalculations.length > 0) {
      const totals = userCalculations.map(c => c.totalEmissions);
      stats = {
        total: userCalculations.length,
        average: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
        lowest: Math.min(...totals),
        highest: Math.max(...totals)
      };
    }
    
    res.render('history', {
      calculations: userCalculations.reverse(),
      stats,
      user: req.user
    });
  } catch (err) {
    console.error('Error al obtener historial:', err);
    res.render('history', { calculations: [], stats: null, user: req.user });
  }
});

app.get('/consejos', (req, res) => {
  res.render('tips', { tips, user: req.user });
});

app.get('/acerca', (req, res) => {
  res.render('about', { user: req.user });
});

// === GENERACIÓN DE REPORTE PDF ===
app.get('/descargar-pdf/:id', isAuthenticated, async (req, res) => {
  try {
    const calculation = await auth.getCalculation(req.params.id, req.user.id);
    
    if (!calculation) {
      return res.status(404).send('Reporte no encontrado');
    }
    
    const emissions = {
      transport: calculation.transportEmissions,
      energy: calculation.energyEmissions,
      food: calculation.foodEmissions,
      consumption: calculation.consumptionEmissions,
      total: calculation.totalEmissions,
      level: calculation.level
    };
    
    // Los datos ya están en formato JSON
    const data = calculation.data || {};
    
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true
    });
    
    const fileName = `reporte-carbono-${calculation._id}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    doc.pipe(res);
    
    // Encabezado
    doc.fillColor('#27AE60').rect(0, 0, 612, 100).fill();
    doc.fillColor('#fff')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('EcoCalc', 50, 25);
    
    doc.fontSize(16)
       .text('Reporte de Huella de Carbono', 50, 55);
    
    doc.fontSize(9)
       .font('Helvetica')
       .text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, 50, 78);
    
    doc.y = 120;
    
    // Información general
    doc.fillColor('#27AE60')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text('INFORMACION GENERAL', 50, doc.y);
    
    doc.y += 20;
    
    const infoBoxY = doc.y;
    doc.fillColor('#f5f5f5')
       .rect(50, infoBoxY, 500, 50)
       .fill();
    
    doc.fillColor('#333')
       .fontSize(11)
       .font('Helvetica')
       .text(`Nombre: ${calculation.name || 'Anonimo'}`, 60, infoBoxY + 12);
    
    doc.text(`Fecha de calculo: ${new Date(calculation.createdAt).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`, 60, infoBoxY + 30);
    
    doc.y = infoBoxY + 70;
    
    // Resultado principal
    const levels = {
      'excelente': { text: 'Excelente', color: '#27AE60' },
      'bueno': { text: 'Bueno', color: '#2ECC71' },
      'promedio': { text: 'Promedio', color: '#F39C12' },
      'alto': { text: 'Alto', color: '#E67E22' },
      'muy_alto': { text: 'Muy Alto', color: '#E74C3C' }
    };
    
    const levelData = levels[emissions.level];
    const resultBoxY = doc.y;
    
    doc.fillColor(levelData.color)
       .rect(50, resultBoxY, 500, 100)
       .fill();
    
    doc.fillColor('#fff')
       .fontSize(12)
       .font('Helvetica')
       .text('Tu Huella de Carbono Anual', 60, resultBoxY + 15);
    
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .text(`${emissions.total}`, 60, resultBoxY + 35);
    
    doc.fontSize(14)
       .text('kg CO2', 220, resultBoxY + 50);
    
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Nivel: ${levelData.text}`, 350, resultBoxY + 45);
    
    doc.y = resultBoxY + 120;
    
    // Desglose por categorías
    doc.fillColor('#27AE60')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text('DESGLOSE DE EMISIONES', 50, doc.y);
    
    doc.y += 20;
    
    const total = emissions.total;
    const categories = [
      { name: 'TRANSPORTE', value: emissions.transport, color: '#3498DB' },
      { name: 'ENERGIA', value: emissions.energy, color: '#F39C12' },
      { name: 'ALIMENTACION', value: emissions.food, color: '#E67E22' },
      { name: 'CONSUMO', value: emissions.consumption, color: '#9B59B6' }
    ];
    
    categories.forEach(cat => {
      const barY = doc.y;
      const barWidth = 400;
      const percentage = total > 0 ? (cat.value / total) * 100 : 0;
      
      doc.fontSize(10)
         .fillColor('#333')
         .text(cat.name, 60, barY);
      
      doc.fontSize(10)
         .fillColor('#666')
         .text(`${cat.value} kg (${percentage.toFixed(1)}%)`, 460, barY, { 
           width: 100, 
           align: 'right' 
         });
      
      doc.fillColor('#e0e0e0')
         .rect(60, barY + 18, barWidth, 12)
         .fill();
      
      if (percentage > 0) {
        doc.fillColor(cat.color)
           .rect(60, barY + 18, (barWidth * percentage) / 100, 12)
           .fill();
      }
      
      doc.y = barY + 40;
    });
    
    doc.y += 10;
    
    // Comparativas globales
    doc.fillColor('#27AE60')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text('COMPARATIVAS GLOBALES', 50, doc.y);
    
    doc.y += 20;
    
    const worldAverage = 8000;
    const countryAverage = 6000;
    const worldDiff = (((total - worldAverage) / worldAverage) * 100).toFixed(1);
    const countryDiff = (((total - countryAverage) / countryAverage) * 100).toFixed(1);
    
    const compY = doc.y;
    
    doc.fillColor('#e8f8f5')
       .rect(50, compY, 230, 60)
       .fill();
    
    doc.fillColor('#27AE60')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('Promedio Mundial', 60, compY + 10);
    
    doc.fillColor('#333')
       .fontSize(10)
       .font('Helvetica')
       .text(`${worldAverage} kg CO2/anio`, 60, compY + 28);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor(worldDiff < 0 ? '#27AE60' : '#E74C3C')
       .text(`${worldDiff > 0 ? '+' : ''}${worldDiff}%`, 60, compY + 43);
    
    doc.fillColor('#e8f8f5')
       .rect(320, compY, 230, 60)
       .fill();
    
    doc.fillColor('#27AE60')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('Promedio Nacional', 330, compY + 10);
    
    doc.fillColor('#333')
       .fontSize(10)
       .font('Helvetica')
       .text(`${countryAverage} kg CO2/anio`, 330, compY + 28);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor(countryDiff < 0 ? '#27AE60' : '#E74C3C')
       .text(`${countryDiff > 0 ? '+' : ''}${countryDiff}%`, 330, compY + 43);
    
    doc.y = compY + 80;
    
    // Detalles del cuestionario
    doc.fillColor('#27AE60')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text('DETALLES DE TU CUESTIONARIO', 50, doc.y);
    
    doc.y += 20;
    
    const detailsBoxY = doc.y;
    const detailsBoxHeight = 140;
    
    doc.fillColor('#f5f5f5')
       .rect(50, detailsBoxY, 500, detailsBoxHeight)
       .fill();
    
    const details = [];
    
    if (data.carKm) details.push(`Km en auto por semana: ${data.carKm} km`);
    if (data.publicTransportHours) details.push(`Transporte publico por semana: ${data.publicTransportHours} horas`);
    if (data.flights) details.push(`Vuelos por anio: ${data.flights}`);
    if (data.electricity) details.push(`Electricidad: ${data.electricity} kWh/mes`);
    if (data.gas) details.push(`Gas natural: ${data.gas} m3/mes`);
    if (data.diet) details.push(`Tipo de dieta: ${data.diet}`);
    if (data.shopping) details.push(`Compras por mes: ${data.shopping}`);
    if (data.recycles === 'on') details.push(`Recicla: Si`);
    
    doc.fillColor('#333')
       .fontSize(9)
       .font('Helvetica');
    
    let currentY = detailsBoxY + 12;
    const lineHeight = 18;
    
    details.forEach((detail, idx) => {
      const column = idx % 2;
      const row = Math.floor(idx / 2);
      const x = column === 0 ? 60 : 310;
      const y = currentY + (row * lineHeight);
      
      doc.text(detail, x, y);
    });
    
    doc.y = detailsBoxY + detailsBoxHeight + 20;
    
    // Recomendaciones
    doc.fillColor('#27AE60')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text('RECOMENDACIONES', 50, doc.y);
    
    doc.y += 20;
    
    doc.fillColor('#333')
       .fontSize(10)
       .font('Helvetica');
    
    const recommendations = [
      '- Considera cambiar a transporte publico para reducir emisiones de transporte',
      '- Mejora el aislamiento de tu hogar y usa energias renovables',
      '- Reduce el consumo de carne roja y aumenta vegetales en tu dieta',
      '- Compra productos locales y recicla regularmente'
    ];
    
    recommendations.forEach(rec => {
      doc.text(rec, 60, doc.y);
      doc.y += 18;
    });
    
    doc.y += 10;
    
    doc.strokeColor('#ddd')
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();
    
    doc.y += 15;
    
    doc.fillColor('#777')
       .fontSize(8)
       .font('Helvetica')
       .text('Este reporte fue generado automaticamente por EcoCalc - Calculadora de Huella de Carbono', 
             50, doc.y, { align: 'center', width: 500 });
    
    doc.y += 12;
    
    doc.text('Reduce tu huella de carbono, cuidemos nuestro planeta', 
             50, doc.y, { align: 'center', width: 500 });
    
    doc.end();
  } catch (err) {
    console.error('Error al generar PDF:', err);
    res.status(500).send('Error al generar el PDF');
  }
});

// === INICIALIZAR SERVIDOR Y BASES DE DATOS ===
Promise.all([
  db.initializeDatabase(),
  connectMongoDB()
]).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Calculadora de Huella de Carbono iniciada`);
    console.log(`Sistema de login activado`);
    console.log(`PostgreSQL: Usuarios`);
    console.log(`MongoDB: Cálculos`);
  });
}).catch(err => {
  console.error('Error al inicializar la aplicación:', err);
  process.exit(1);
});