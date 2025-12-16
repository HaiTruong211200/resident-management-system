const {createClient} = require('@supabase/supabase-js');

let supabase = null;

function initSupabase(url, serviceRoleKey, anonKey) {
  if (!url) throw new Error('SUPABASE_URL missing');
  const key = serviceRoleKey || anonKey;
  if (!key) throw new Error('Supabase key missing (service role or anon)');
  supabase = createClient(url, key, {auth: {persistSession: false}});
  console.log(
      'Supabase client initialized (key type:',
      serviceRoleKey ? 'service-role' : 'anon', ')');
  return supabase;
}

function getSupabase() {
  if (!supabase) throw new Error('Supabase not initialized');
  return supabase;
}

module.exports = {
  initSupabase,
  getSupabase
};