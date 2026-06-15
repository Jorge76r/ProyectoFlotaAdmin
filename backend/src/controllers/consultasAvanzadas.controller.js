const supabase = require('../../config/supabase');

// ─────────────────────────────────────────────
// GET /api/consultas/vehiculos-no-aptos
// Consulta Avanzada 1:
// Vehículos con inspecciones no aptas y alertas activas
// ─────────────────────────────────────────────
const vehiculosNoAptos = async (req, res, next) => {
  try {
    const { data, error } = await supabase.rpc('reporte_vehiculos_no_aptos');

    // Si no usas RPC, puedes usar la alternativa con Supabase JS:
    // (fallback cuando no se ha creado la función en Supabase)
    if (error || !data) {
      // Fallback: consulta compuesta con JS
      const { data: vehiculos, error: vErr } = await supabase
        .from('vehiculos')
        .select(`
          id, placa, marca, modelo, estado,
          inspecciones ( id, apto_para_viaje, fecha_inspeccion ),
          alertas ( id, resuelta )
        `);

      if (vErr) throw vErr;

      const resultado = vehiculos
        .map(v => {
          const inspeccionesNoAptas = (v.inspecciones || []).filter(i => !i.apto_para_viaje).length;
          const alertasActivas      = (v.alertas || []).filter(a => !a.resuelta).length;
          const ultimaInspeccion    = (v.inspecciones || []).sort((a, b) =>
            new Date(b.fecha_inspeccion) - new Date(a.fecha_inspeccion))[0]?.fecha_inspeccion || null;

          return {
            placa:               v.placa,
            vehiculo:            `${v.marca} ${v.modelo}`,
            estado:              v.estado,
            total_inspecciones:  (v.inspecciones || []).length,
            inspecciones_no_aptas: inspeccionesNoAptas,
            alertas_activas:     alertasActivas,
            ultima_inspeccion:   ultimaInspeccion,
          };
        })
        .filter(v => v.inspecciones_no_aptas > 0 || v.alertas_activas > 0)
        .sort((a, b) => b.alertas_activas - a.alertas_activas);

      return res.json({ success: true, total: resultado.length, data: resultado });
    }

    res.json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// GET /api/consultas/eficiencia-choferes
// Consulta Avanzada 2:
// Resumen de eficiencia de choferes (km, combustible, viajes)
// ─────────────────────────────────────────────
const eficienciaChoferes = async (req, res, next) => {
  try {
    const { data: choferes, error: chErr } = await supabase
      .from('choferes')
      .select(`
        id, nombre, apellido, licencia, activo,
        viajes ( id, distancia_km, consumo_estimado_lt, estado )
      `)
      .eq('activo', true);

    if (chErr) throw chErr;

    const resultado = choferes.map(ch => {
      const viajes = ch.viajes || [];
      const kmTotales  = viajes.reduce((s, v) => s + (Number(v.distancia_km) || 0), 0);
      const combustible = viajes.reduce((s, v) => s + (Number(v.consumo_estimado_lt) || 0), 0);
      const completados = viajes.filter(v => v.estado === 'completado').length;

      return {
        chofer:             `${ch.nombre} ${ch.apellido}`,
        licencia:           ch.licencia,
        total_viajes:       viajes.length,
        km_totales:         Math.round(kmTotales * 100) / 100,
        km_promedio_viaje:  viajes.length ? Math.round((kmTotales / viajes.length) * 100) / 100 : 0,
        combustible_total_lt: Math.round(combustible * 100) / 100,
        lt_por_100km:       kmTotales > 0 ? Math.round((combustible / kmTotales * 100) * 100) / 100 : 0,
        viajes_completados: completados,
      };
    }).sort((a, b) => b.km_totales - a.km_totales);

    res.json({ success: true, total: resultado.length, data: resultado });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// PLACEHOLDER para consultas asignadas por el profesor
// Agregar aquí los métodos de las consultas del Avance 1
// ─────────────────────────────────────────────
// const consultaAvanzada1Profesor = async (req, res, next) => { ... };
// const consultaAvanzada2Profesor = async (req, res, next) => { ... };

module.exports = { vehiculosNoAptos, eficienciaChoferes };
