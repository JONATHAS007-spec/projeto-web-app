import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validacao das variaveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variaveis de ambiente do Supabase nao configuradas!');
  console.warn('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
      },
    },
  }
);

// Types
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  age_range: '18-30' | '31-45' | '46-60' | '60+';
  main_goal: string;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  skin_type: string;
  created_at: string;
  updated_at: string;
};

export type DailyRoutine = {
  id: string;
  user_id: string;
  date: string;
  task_name: string;
  task_type: string;
  completed: boolean;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  created_at: string;
};

export type ProgressTracking = {
  id: string;
  user_id: string;
  date: string;
  energy_level: number;
  skin_quality: number;
  sleep_quality: number;
  hydration: number;
  mood: number;
  notes?: string;
  created_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_name: string;
  achievement_type: string;
  points: number;
  progress: number;
  target: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
};
