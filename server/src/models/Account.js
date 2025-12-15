const {getSupabase} = require('../config/db');
const bcrypt = require('bcryptjs');
// Pure Supabase DAO implementation (mongoose removed)
// Table: accounts (id uuid pk, username unique, email unique, pass hashed,
// role)

async function createAccount({username, email, pass, role = 'user'}) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  const supabase = getSupabase();
  const {data, error} = await supabase.from('accounts')
                            .insert({username, email, pass: hash, role})
                            .select('id, username, email, role')
                            .single();
  if (error) throw error;
  return data;
}

async function findByEmail(email, withPassword = false) {
  const supabase = getSupabase();
  const cols = withPassword ? 'id, username, email, pass, role' :
                              'id, username, email, role';
  const {data, error} = await supabase.from('accounts')
                            .select(cols)
                            .eq('email', email)
                            .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function findById(id, withPassword = false) {
  const supabase = getSupabase();
  const cols = withPassword ? 'id, username, email, pass, role' :
                              'id, username, email, role';
  const {data, error} =
      await supabase.from('accounts').select(cols).eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

async function deleteMany() {
  const supabase = getSupabase();
  const {error} =
      await supabase.from('accounts').delete().not('id', 'is', null);
  if (error) throw error;
}

module.exports = {
  createAccount,
  findByEmail,
  findById,
  comparePassword,
  deleteMany
};
