const supabase = require('../../config/supabase');

const getAll = async (req, res, next) => {
  try {
    const { activo } = req.query;
    let query = supabase.from('choferes').select('*').order('apellido');
    if (activo !== undefined) query = query.eq('activo', activo === 'true');
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('choferes').select('*').eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, error: 'Chofer no encontrado' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { nombre, apellido, licencia, telefono, email } = req.body;
    if (!nombre || !apellido || !licencia) {
      return res.status(400).json({ success: false, error: 'Campos requeridos: nombre, apellido, licencia' });
    }
    const { data, error } = await supabase
      .from('choferes').insert([{ nombre, apellido, licencia, telefono, email }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { nombre, apellido, licencia, telefono, email, activo } = req.body;
    const { data, error } = await supabase
      .from('choferes').update({ nombre, apellido, licencia, telefono, email, activo })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('choferes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Chofer eliminado' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
