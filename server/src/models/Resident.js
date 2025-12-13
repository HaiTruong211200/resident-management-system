const { getSupabase } = require("../config/db");
// ERD-aligned Supabase DAO. Table `residents` uses int PKs and snake_case.
// Columns include many demographic fields per ERD. FK: household_id ->
// households.id (int)

async function createResident(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("residents")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function updateResident(id, payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("residents")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function findById(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function searchResidents(keyword) {
  const supabase = getSupabase();
  const isInt = /^\d+$/.test(String(keyword));
  const orParts = [
    `full_name.ilike.%${keyword}%`,
    `id_card_number.ilike.%${keyword}%`,
  ];
  if (isInt) orParts.push(`household_id.eq.${Number(keyword)}`);
  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .or(orParts.join(","));
  if (error) throw error;
  return data || [];
}

async function deleteMany() {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("residents")
    .delete()
    .not("id", "is", null);
  if (error) throw error;
}

async function deleteResident(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('residents')
    .delete()
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data || null;
}

async function getAllResidents(options = {}) {
  const {
    page = 1,
    limit = 20,
    household_id,
    sort_by,
    order = "asc",
  } = options;
  const supabase = getSupabase();
  const from = Math.max(0, (Number(page) - 1) * Number(limit));
  const to = from + Number(limit) - 1;

  // Normalize order
  const ascending = String(order).toLowerCase() !== "desc";

  // Start query
  let query = supabase.from("residents").select("*", { count: "exact" });

  if (household_id) query = query.eq("household_id", household_id);

  // Apply sorting: primary sort_by then fallback to id for stable ordering
  if (sort_by && typeof sort_by === "string") {
    // simple whitelist to avoid SQL injection via column names
    const allowed = new Set([
      "household_id",
      "id",
      "full_name",
      "date_of_birth",
    ]);
    if (allowed.has(sort_by)) {
      query = query.order(sort_by, { ascending });
      if (sort_by !== "id") query = query.order("id", { ascending: true });
    } else {
      // invalid sort_by -> fallback
      query = query.order("id", { ascending: true });
    }
  } else {
    query = query.order("id", { ascending: true });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

module.exports = {
  createResident,
  updateResident,
  findById,
  searchResidents,
  deleteMany,
  deleteResident,
  getAllResidents,
};
