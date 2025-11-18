import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types for TypeScript intellisense
export interface Feedback {
  id: string;
  created_at: string;
  name: string | null;
  location: string | null;
  rating: number;
  feedback: string | null;
  rating_type: 'loved' | 'okay' | 'not_good';
}

export interface DashboardStats {
  total_reviews: number;
  average_rating: number;
  five_star_percentage: number;
  trend: number;
}
