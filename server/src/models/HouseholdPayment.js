const {getSupabase} = require('../config/db');
// ERD-aligned DAO. Table: household_payments with int PK payment_id

async function create(payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('household_payments')
                            .insert(payload)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('household_payments').delete().not('id', 'is', null);
  if (error) throw error;
}

async function list() {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('household_payments').select('*');
  if (error) throw error;
  return data || [];
}

async function findById(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('household_payments')
                            .select('*')
                            .eq('payment_id', id)
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
