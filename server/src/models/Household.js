const {getSupabase} = require('../config/db');
// ERD-aligned Supabase DAO. Table: households (int PK), columns:
// householdHeadId, houseNumber, street, ward, district, numberCount (ints)

async function createHousehold(payload) {
  const supabase = getSupabase();
  // Ensure numberCount starts at 1 if not provided
  if (!payload.numberCount) {
    payload.numberCount = 1;
  }
  const {data, error} =
      await supabase.from('households').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function updateHousehold(id, payload) {
  const supabase = getSupabase();
  // Add updatedAt timestamp
  payload.updatedAt = new Date().toISOString();
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
  const {data, error} = await supabase.from('households')
                            .select('*')
                            .eq('id', id)
                            .is('deletedAt', null)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function searchHouseholds(keyword) {
  const supabase = getSupabase();
  const num = Number(keyword);
  const parts = [];
  if (!Number.isNaN(num)) {
    parts.push(`houseNumber.eq.${num}`);
    parts.push(`street.eq.${num}`);
    parts.push(`ward.eq.${num}`);
    parts.push(`district.eq.${num}`);
  }
  // If not numeric, no matches for ints; return empty set via impossible filter
  const filter = parts.length ? parts.join(',') : 'id.eq.-1';
  const {data, error} = await supabase.from('households')
                            .select('*')
                            .or(filter)
                            .is('deletedAt', null);
  if (error) throw error;
  return data || [];
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('households').delete().not('id', 'is', null);
  if (error) throw error;
}
async function getAllHouseholds() {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('households')
                            .select('*')
                            .is('deletedAt', null)
                            .order('id', {ascending: true});
  if (error) throw error;
  return data || [];
}

async function updateNumberCount(householdId, increment = true) {
  const supabase = getSupabase();
  const household = await findById(householdId);
  if (!household) throw new Error('Household not found');

  const newCount = increment ? household.numberCount + 1 :
                               Math.max(0, household.numberCount - 1);
  const {data, error} =
      await supabase.from('households')
          .update({numberCount: newCount, updatedAt: new Date().toISOString()})
          .eq('id', householdId)
          .select('*')
          .single();
  if (error) throw error;
  return data;
}

async function softDeleteHousehold(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('households')
                            .update({
                              deletedAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString()
                            })
                            .eq('id', id)
                            .is('deletedAt', null)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

module.exports = {
  createHousehold,
  updateHousehold,
  findById,
  searchHouseholds,
  deleteMany,
  getAllHouseholds,
  updateNumberCount,
  softDeleteHousehold,
};
