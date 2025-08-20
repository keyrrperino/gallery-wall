import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}



// Client-side Supabase client with anon key and error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence to avoid JWT conflicts
    autoRefreshToken: false, // Disable auto refresh since we're using Lucia
  },
});

// Server-side admin client with service role key (for API routes and server operations)
let adminClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseAdmin = () => {
  if (adminClient) {
    return adminClient;
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Failed to initialize Supabase admin client:', error);
    throw error;
  }

  return adminClient;
};