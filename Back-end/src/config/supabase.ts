import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseSecretKey);

export const supabase = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in Back-end/.env.');
  }

  return supabase;
};
