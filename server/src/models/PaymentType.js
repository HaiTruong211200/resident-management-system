const {getSupabase} = require('../config/db');
// ERD-aligned DAO. Table: payment_types (int PK as payment_type_id)

async function create(payload) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('paymentTypes').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} = await supabase.from('paymentTypes')
                      .delete()
                      .not('paymentTypeId', 'is', null);
  if (error) throw error;
}

async function list() {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('paymentTypes').select('*');
  if (error) throw error;
  return data || [];
}

async function findById(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('paymentTypes')
                            .select('*')
                            .eq('paymentTypeId', id)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function update(id, payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('paymentTypes')
                            .update(payload)
                            .eq('paymentTypeId', id)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function deleteById(id) {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('paymentTypes').delete().eq('paymentTypeId', id);
  if (error) throw error;
}

module.exports = {
  create,
  deleteMany,
  list,
  findById,
  update,
  deleteById,
};
