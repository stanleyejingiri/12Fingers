// src/lib/supabase.ts - MUST EXPORT supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://one2fingers-backend.onrender.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

console.log("🔧 [supabase] Configuring client with URL:", supabaseUrl);

// THIS EXPORT IS CRITICAL - must be named 'supabase'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

// Also export apiClient for our new backend
const API_BASE_URL = 'https://one2fingers-backend.onrender.com/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

console.log("✅ Both exports available: supabase and apiClient");




// src/lib/supabase.ts - REPLACE ENTIRE FILE WITH THIS:
// Simple API client for your backend
/*
const API_BASE_URL = 'https://one2fingers-backend.onrender.com/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
console.log("🔧 [apiClient] Configured for backend:", API_BASE_URL);
*/




/*
import { createClient } from '@supabase/supabase-js';

// FORCE local PostgREST configuration
const supabaseUrl = 'https://one2fingers-backend.onrender.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

console.log("🔧 [supabase] Configuring client with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

// Test connection on import
supabase.from('worker_profiles').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ [supabase] Initial connection test failed:', error);
    } else {
      console.log('✅ [supabase] Initial connection test successful');
    }
  });
*/



/*
import { createClient } from '@supabase/supabase-js';

// HARDCODE PostgREST URL (port 3001)
const supabaseUrl = 'https://one2fingers-backend.onrender.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

console.log('🔌 Using PostgREST at:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});


/*import { createClient } from '@supabase/supabase-js';*/

/*const supabaseUrl = 'https://lnvvmjdnpycmzhglypns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudnZtamRucHljbXpoZ2x5cG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNjI1MzQsImV4cCI6MjA1MjczODUzNH0.orqY2Wl56GHx107DTmUwNwPxA-rMu9gnvcV3tvX1IHA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },

*/
// src/lib/supabase.ts
/* const supabase = createClient(
  'https://pwdfwxpuxsxjqewyblmy.supabase.co', // ← Update this
  'eyJhbGciOiJIUzI1NiIsInR5c...' // ← And this (new anon key)
);*/


/*PROJECT ID: pwdfwxpuxsxjqewyblmy*/
/*PUBLIC ANON: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGZ3eHB1eHN4anFld3libG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzU3MDYsImV4cCI6MjA2NDgxMTcwNn0.jKaK7mqcyeRzkTikIBDYEsiMSALf37BVcCnxaA-ZM4E*/
