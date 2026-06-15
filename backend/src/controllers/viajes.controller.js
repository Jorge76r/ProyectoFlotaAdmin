const supabase = require('../../config/supabase');

// Consumo estimado: 37 lt/100 km para camión pesado estándar
const CONSUMO_LT_POR_KM = 0.37;

const getAll = async (req, res, next) => {
  try {
    const { estado, chofer_id, vehiculo_id } = req.query;
    let query = supabase
      .from('viajes')
      .select(`*, vehiculos(placa,marca,modelo), choferes(nombre,apellido)`)
      .order('fecha_salida', { ascending: false });
    if (estado)      query = query.eq('estado', estado);
    if (chofer_id)   query = query.eq('chofer_id', chofer_id);
    if (vehiculo_id) query = query.eq('vehiculo_id', vehiculo_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .select(`*, vehiculos(*), choferes(*), inspecciones(*)`)
      .eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Viaje no encontrado' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { vehiculo_id, chofer_id, inspeccion_id, origen, destino, distancia_km, fecha_salida, observaciones } = req.body;
    if (!vehiculo_id || !chofer_id || !origen || !destino || !distancia_km || !fecha_salida) {
      return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    }
    // Calcular consumo estimado automáticamente
    const consumo_estimado_lt = Math.round(distancia_km * CONSUMO_LT_POR_KM * 100) / 100;

    const { data, error } = await supabase
      .from('viajes')
      .insert([{ vehiculo_id, chofer_id, inspeccion_id, origen, destino, distancia_km, consumo_estimado_lt, fecha_salida, observaciones }])
      .select().single();
    if (error) throw error;

    // Cambiar estado del vehículo a en_viaje
    await supabase.from('vehiculos').update({ estado: 'en_viaje' }).eq('id', vehiculo_id);

    res.status(201).json({ success: true, data, consumo_estimado_lt });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { origen, destino, distancia_km, fecha_salida, fecha_llegada, estado, observaciones } = req.body;
    const updates = { origen, destino, distancia_km, fecha_salida, fecha_llegada, estado, observaciones };
    if (distancia_km) updates.consumo_estimado_lt = Math.round(distancia_km * CONSUMO_LT_POR_KM * 100) / 100;

    const { data, error } = await supabase
      .from('viajes').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;

    // Si el viaje se completa o cancela, liberar el vehículo
    if (estado === 'completado' || estado === 'cancelado') {
      await supabase.from('vehiculos').update({ estado: 'disponible' }).eq('id', data.vehiculo_id);
    }

    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('viajes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Viaje eliminado' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
