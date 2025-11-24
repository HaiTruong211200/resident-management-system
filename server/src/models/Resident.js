const {getSupabase} = require('../config/db');
// ERD-aligned Supabase DAO. Table `residents` uses int PKs and snake_case.
// Columns include many demographic fields per ERD. FK: household_id ->
// households.id (int)

async function createResident(payload) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('residents').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function updateResident(id, payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('residents')
                            .update(payload)
                            .eq('id', id)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function findById(id) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('residents').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function searchResidents(keyword) {
  const supabase = getSupabase();
  const isInt = /^\d+$/.test(String(keyword));
  const orParts =
      [`full_name.ilike.%${keyword}%`, `id_card_number.ilike.%${keyword}%`];
  if (isInt) orParts.push(`household_id.eq.${Number(keyword)}`);
  const {data, error} =
      await supabase.from('residents').select('*').or(orParts.join(','));
  if (error) throw error;
  return data || [];
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('residents').delete().not('id', 'is', null);
  if (error) throw error;
}

module.exports = {
  createResident,
  updateResident,
  findById,
  searchResidents,
  deleteMany
};
