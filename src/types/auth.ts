import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  walletBalance?: number;
}
