const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión de Flota',
    version: '1.0.0',
    endpoints: '/api',
    health: '/api/health'
  });
});

// Rutas de la API
app.use('/api', routes);

// Middleware de errores (siempre al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api`);
  console.log(`💚 Health check en http://localhost:${PORT}/api/health`);
});