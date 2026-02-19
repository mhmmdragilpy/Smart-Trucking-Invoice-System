import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    // Only throw in browser/runtime, might skip during build if env missing
    if (typeof window !== 'undefined') {
        console.error('Missing Supabase Environment Variables');
    }
}

export const supabase = createClient(supabaseUrl, supabaseKey);
