import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Accept both the standard anon key and the publishable key name from Supabase's quick-start template
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey.trim() !== '' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

// Initialize client with configured values, or dummy values if not configured
const clientUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(clientUrl, clientKey);

if (!isSupabaseConfigured()) {
  console.warn(
    'Supabase integration: Credentials are not configured. The app will fall back to LocalStorage and local state. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in your .env.local file.'
  );
}
