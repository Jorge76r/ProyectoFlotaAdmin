const supabase = require('../../config/supabase');

const getAll = async (req, res, next) => {
  try {
    const { resuelta, severidad, vehiculo_id } = req.query;
    let query = supabase
      .from('alertas')
      .select(`*, vehiculos(placa, marca, modelo)`)
      .order('creado_en', { ascending: false });
    if (resuelta  !== undefined) query = query.eq('resuelta', resuelta === 'true');
    if (severidad)  query = query.eq('severidad', severidad);
    if (vehiculo_id) query = query.eq('vehiculo_id', vehiculo_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const resolver = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('alertas').update({ resuelta: true }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, resolver };
