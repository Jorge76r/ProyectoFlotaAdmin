require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const routes       = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware global ────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging básico ───────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Rutas ────────────────────────────────────
app.use('/api', routes);

// ── 404 ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// ── Error handler ────────────────────────────
app.use(errorHandler);

// ── Arranque ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚛  Sistema de Flotas — API corriendo en http://localhost:${PORT}`);
  console.log(`📋  Endpoints disponibles:`);
  console.log(`    GET  /api/health`);
  console.log(`    CRUD /api/inspecciones`);
  console.log(`    CRUD /api/vehiculos`);
  console.log(`    CRUD /api/choferes`);
  console.log(`    CRUD /api/viajes`);
  console.log(`    GET  /api/alertas`);
  console.log(`    GET  /api/consultas/vehiculos-no-aptos`);
  console.log(`    GET  /api/consultas/eficiencia-choferes\n`);
});

module.exports = app;
