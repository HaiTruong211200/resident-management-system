const {getSupabase} = require('../config/db');
// ERD-aligned DAO. Table: household_payments with int PK payment_id

async function create(payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('householdPayments')
                            .insert(payload)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} = await supabase.from('householdPayments')
                      .delete()
                      .not('paymentId', 'is', null);
  if (error) throw error;
}

async function list() {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('householdPayments').select('*');
  if (error) throw error;
  return data || [];
}

async function findById(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('householdPayments')
                            .select('*')
                            .eq('paymentId', id)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function update(id, payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('householdPayments')
                            .update(payload)
                            .eq('paymentId', id)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function updateByPaymentType(paymentTypeId, payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('householdPayments')
                            .update(payload)
                            .eq('paymentTypeId', paymentTypeId)
                            .select('*');
  if (error) throw error;
  return data;
}

module.exports = {
  create,
  deleteMany,
  list,
  findById,
  update,
  updateByPaymentType,
};
