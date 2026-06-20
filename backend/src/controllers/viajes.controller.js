const supabase = require('../../config/supabase');

const getAll = async (req, res, next) => {
  try {
    const { estado, vehiculo_id, chofer_id } = req.query;
    let query = supabase.from('viajes').select(`
      *,
      vehiculos(placa, marca, modelo),
      choferes(nombre, apellido)
    `).order('fecha_inicio', { ascending: false });
    
    if (estado) query = query.eq('estado', estado);
    if (vehiculo_id) query = query.eq('vehiculo_id', vehiculo_id);
    if (chofer_id) query = query.eq('chofer_id', chofer_id);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .select(`
        *,
        vehiculos(placa, marca, modelo),
        choferes(nombre, apellido, licencia)
      `)
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Viaje no encontrado' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { 
      vehiculo_id, chofer_id, 
      fecha_inicio, fecha_fin,
      origen, destino, 
      distancia_km, consumo_estimado_lt,
      estado, observaciones 
    } = req.body;
    
    if (!vehiculo_id || !chofer_id || !origen || !destino) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos requeridos: vehiculo_id, chofer_id, origen, destino' 
      });
    }
    
    const { data, error } = await supabase
      .from('viajes')
      .insert([{ 
        vehiculo_id, chofer_id, 
        fecha_inicio, fecha_fin,
        origen, destino, 
        distancia_km, consumo_estimado_lt,
        estado: estado || 'pendiente', 
        observaciones 
      }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { 
      fecha_inicio, fecha_fin,
      origen, destino, 
      distancia_km, consumo_estimado_lt,
      estado, observaciones 
    } = req.body;
    
    const { data, error } = await supabase
      .from('viajes')
      .update({ 
        fecha_inicio, fecha_fin,
        origen, destino, 
        distancia_km, consumo_estimado_lt,
        estado, observaciones,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Viaje no encontrado' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('viajes')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.json({ success: true, message: 'Viaje eliminado' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };