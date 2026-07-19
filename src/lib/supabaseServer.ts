import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Fallback to a dummy key during static build time if the secret environment variable is not defined yet
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key-for-static-compilation';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
