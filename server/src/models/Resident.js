const {getSupabase} = require('../config/db');
// ERD-aligned Supabase DAO. Table `residents` uses int PKs and camelCase.
// Columns include many demographic fields per ERD. FK: householdId ->
// households.id (int)

async function createResident(payload) {
  const supabase = getSupabase();
  console.log('Creating resident with payload:', payload);
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
  const {data, error} = await supabase.from('residents')
                            .select('*')
                            .eq('id', id)
                            .is('deletedAt', null)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function searchResidents(keyword) {
  const supabase = getSupabase();
  const isInt = /^\d+$/.test(String(keyword));
  const orParts = [
    `fullName.ilike.%${keyword}%`,
    `idCardNumber.ilike.%${keyword}%`,
  ];
  if (isInt) orParts.push(`householdId.eq.${Number(keyword)}`);
  const {data, error} = await supabase.from('residents')
                            .select('*')
                            .or(orParts.join(','))
                            .is('deletedAt', null);
  if (error) throw error;
  return data || [];
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('residents').delete().not('id', 'is', null);
  if (error) throw error;
}

async function deleteResident(id) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('residents')
                            .update({deletedAt: new Date().toISOString()})
                            .eq('id', id)
                            .is('deletedAt', null)
                            .select('*')
                            .single();
  if (error) throw error;
  return data || null;
}

async function getAllResidents(options = {}) {
  const {page = 1, limit = 20, householdId, sortBy, order = 'asc'} = options;
  const supabase = getSupabase();
  const from = Math.max(0, (Number(page) - 1) * Number(limit));
  const to = from + Number(limit) - 1;

  // Normalize order
  const ascending = String(order).toLowerCase() !== 'desc';

  // Start query
  let query = supabase.from('residents')
                  .select('*', {count: 'exact'})
                  .is('deletedAt', null);

  if (householdId) query = query.eq('householdId', householdId);

  // Apply sorting: primary sortBy then fallback to id for stable ordering
  if (sortBy && typeof sortBy === 'string') {
    // simple whitelist to avoid SQL injection via column names
    const allowed = new Set(['householdId', 'id', 'fullName', 'dateOfBirth']);
    if (allowed.has(sortBy)) {
      query = query.order(sortBy, {ascending});
      if (sortBy !== 'id') query = query.order('id', {ascending: true});
    } else {
      // invalid sortBy -> fallback
      query = query.order('id', {ascending: true});
    }
  } else {
    query = query.order('id', {ascending: true});
  }

  const {data, error, count} = await query.range(from, to);
  if (error) throw error;
  return {data: data || [], count: count || 0};
}

async function findAllHouseholdOwners(householdId) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('residents')
                            .select('*')
                            .eq('householdId', householdId)
                            .eq('relationshipToHead', 'Chủ hộ')
                            .is('deletedAt', null);
  if (error) throw error;
  return data || [];
}

async function updateRelationship(id, relationshipToHead) {
  const supabase = getSupabase();
  const {data, error} = await supabase.from('residents')
                            .update({relationshipToHead})
                            .eq('id', id)
                            .select('*')
                            .single();
  if (error) throw error;
  return data;
}

async function clearHouseholdForResidents(householdId) {
  const supabase = getSupabase();
  const {data, error} =
      await supabase.from('residents')
          .update({householdId: null, relationshipToHead: 'Khác'})
          .eq('householdId', householdId)
          .select('*');
  if (error) throw error;
  return data || [];
}

module.exports = {
  createResident,
  updateResident,
  findById,
  searchResidents,
  deleteMany,
  deleteResident,
  getAllResidents,
  findAllHouseholdOwners,
  updateRelationship,
  clearHouseholdForResidents,
};
