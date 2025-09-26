import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;
if (url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key-here') {
  client = createClient(url, key);
}

export const supabase = client;

export const isAuthConfigured = () => {
  return client !== null;
};


