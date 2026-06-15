const supabase = require('../../config/supabase');

// ─────────────────────────────────────────────
// GET /api/inspecciones
// Lista todas las inspecciones con datos del vehículo y chofer
// ─────────────────────────────────────────────
const getAll = async (req, res, next) => {
  try {
    const { vehiculo_id, chofer_id, apto, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('inspecciones')
      .select(`
        *,
        vehiculos ( placa, marca, modelo, tipo ),
        choferes  ( nombre, apellido, licencia )
      `)
      .order('fecha_inspeccion', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (vehiculo_id) query = query.eq('vehiculo_id', vehiculo_id);
    if (chofer_id)   query = query.eq('chofer_id', chofer_id);
    if (apto !== undefined) query = query.eq('apto_para_viaje', apto === 'true');

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, total: count, data });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// GET /api/inspecciones/:id
// ─────────────────────────────────────────────
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inspecciones')
      .select(`
        *,
        vehiculos ( placa, marca, modelo, tipo, kilometraje ),
        choferes  ( nombre, apellido, licencia, telefono )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Inspección no encontrada' });
      throw error;
    }

    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// POST /api/inspecciones
// Crea una inspección y genera alertas automáticamente
// ─────────────────────────────────────────────
const create = async (req, res, next) => {
  try {
    const {
      vehiculo_id, chofer_id,
      presion_llanta_delantera_izq, presion_llanta_delantera_der,
      presion_llanta_trasera_izq,   presion_llanta_trasera_der,
      nivel_aceite, nivel_hidraulico, nivel_refrigerante,
      estado_frenos, kilometraje_actual, observaciones,
    } = req.body;

    // Validaciones básicas
    if (!vehiculo_id || !chofer_id || !estado_frenos || !kilometraje_actual) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: vehiculo_id, chofer_id, estado_frenos, kilometraje_actual',
      });
    }

    // Determinar si el vehículo está apto
    const PRESION_MINIMA = 90;
    const presiones = [
      presion_llanta_delantera_izq, presion_llanta_delantera_der,
      presion_llanta_trasera_izq,   presion_llanta_trasera_der,
    ].filter(Boolean);

    const presionBaja    = presiones.some(p => p < PRESION_MINIMA);
    const aceiteCritico  = nivel_aceite === 'critico';
    const frenosMalos    = estado_frenos === 'malo';

    const apto_para_viaje = !presionBaja && !aceiteCritico && !frenosMalos;

    // Insertar inspección
    const { data: inspeccion, error: insError } = await supabase
      .from('inspecciones')
      .insert([{
        vehiculo_id, chofer_id,
        presion_llanta_delantera_izq, presion_llanta_delantera_der,
        presion_llanta_trasera_izq,   presion_llanta_trasera_der,
        nivel_aceite, nivel_hidraulico, nivel_refrigerante,
        estado_frenos, kilometraje_actual,
        apto_para_viaje, observaciones,
      }])
      .select()
      .single();

    if (insError) throw insError;

    // Actualizar kilometraje del vehículo
    await supabase
      .from('vehiculos')
      .update({ kilometraje: kilometraje_actual })
      .eq('id', vehiculo_id);

    // Generar alertas automáticas
    const alertas = [];
    if (presionBaja)   alertas.push({ vehiculo_id, inspeccion_id: inspeccion.id, tipo: 'presion_llanta',   severidad: 'advertencia', mensaje: 'Presión de llantas por debajo del mínimo (90 PSI)' });
    if (aceiteCritico) alertas.push({ vehiculo_id, inspeccion_id: inspeccion.id, tipo: 'nivel_aceite',     severidad: 'critica',     mensaje: 'Nivel de aceite crítico — no apto para viaje' });
    if (frenosMalos)   alertas.push({ vehiculo_id, inspeccion_id: inspeccion.id, tipo: 'frenos',           severidad: 'critica',     mensaje: 'Estado de frenos malo — vehículo no apto para viaje' });
    if (nivel_hidraulico === 'bajo') alertas.push({ vehiculo_id, inspeccion_id: inspeccion.id, tipo: 'nivel_hidraulico', severidad: 'advertencia', mensaje: 'Nivel de hidráulico bajo' });

    if (alertas.length > 0) {
      await supabase.from('alertas').insert(alertas);
    }

    res.status(201).json({
      success: true,
      data: inspeccion,
      alertas_generadas: alertas.length,
      apto_para_viaje,
    });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// PUT /api/inspecciones/:id
// ─────────────────────────────────────────────
const update = async (req, res, next) => {
  try {
    const campos_permitidos = [
      'presion_llanta_delantera_izq', 'presion_llanta_delantera_der',
      'presion_llanta_trasera_izq',   'presion_llanta_trasera_der',
      'nivel_aceite', 'nivel_hidraulico', 'nivel_refrigerante',
      'estado_frenos', 'apto_para_viaje', 'observaciones',
    ];

    const updates = {};
    campos_permitidos.forEach(campo => {
      if (req.body[campo] !== undefined) updates[campo] = req.body[campo];
    });
    updates.actualizado_en = new Date().toISOString();

    const { data, error } = await supabase
      .from('inspecciones')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Inspección no encontrada' });
      throw error;
    }

    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// ─────────────────────────────────────────────
// DELETE /api/inspecciones/:id
// ─────────────────────────────────────────────
const remove = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('inspecciones')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ success: true, message: 'Inspección eliminada correctamente' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
