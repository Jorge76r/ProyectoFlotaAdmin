const supabase = require('../../config/supabase');

const getAll = async (req, res, next) => {
  try {
    const { estado, tipo } = req.query;
    let query = supabase.from('vehiculos').select('*').order('creado_en', { ascending: false });
    if (estado) query = query.eq('estado', estado);
    if (tipo)   query = query.eq('tipo', tipo);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('vehiculos').select('*').eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { placa, tipo, marca, modelo, anio, kilometraje } = req.body;
    if (!placa || !tipo || !marca || !modelo || !anio) {
      return res.status(400).json({ success: false, error: 'Campos requeridos: placa, tipo, marca, modelo, anio' });
    }
    const { data, error } = await supabase
      .from('vehiculos').insert([{ placa, tipo, marca, modelo, anio, kilometraje: kilometraje || 0 }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { placa, tipo, marca, modelo, anio, kilometraje, estado } = req.body;
    const { data, error } = await supabase
      .from('vehiculos').update({ placa, tipo, marca, modelo, anio, kilometraje, estado })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('vehiculos').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Vehículo eliminado' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
