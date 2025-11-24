const {getSupabase} = require('../config/db');
// ERD-aligned Supabase DAO. Table: households (int PK), columns:
// household_head_id, house_number, street, ward, district (ints)

async function createHousehold(payload) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('households').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function updateHousehold(id, payload) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('households')
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
      await supabase.from('households').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function searchHouseholds(keyword) {
  const supabase = getSupabase();
  const num = Number(keyword);
  const parts = [];
  if (!Number.isNaN(num)) {
    parts.push(`house_number.eq.${num}`);
    parts.push(`street.eq.${num}`);
    parts.push(`ward.eq.${num}`);
    parts.push(`district.eq.${num}`);
  }
  // If not numeric, no matches for ints; return empty set via impossible filter
  const filter = parts.length ? parts.join(',') : 'id.eq.-1';
  const {data, error} = await supabase.from('households')
                            .select('*, household_head_id')
                            .or(filter);
  if (error) throw error;
  return data || [];
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('households').delete().not('id', 'is', null);
  if (error) throw error;
}

module.exports = {
  createHousehold,
  updateHousehold,
  findById,
  searchHouseholds,
  deleteMany
};
