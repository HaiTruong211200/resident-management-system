const {getSupabase} = require('../config/db');
// ERD-aligned DAO. Table: payment_types (int PK as payment_type_id)

async function create(payload) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('payment_types').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('payment_types').delete().not('id', 'is', null);
  if (error) throw error;
}

async function list() {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('payment_types').select('*');
  if (error) throw error;
  return data || [];
}

async function findById(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('payment_types')
                            .select('*')
                            .eq('payment_type_id', id)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

module.exports = {
  create,
  deleteMany,
  list,
  findById
};
