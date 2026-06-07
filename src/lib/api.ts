// src/lib/api.ts
//const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🔴 apiRequest - Making request to:', url);
  console.log('🔴 apiRequest - Options:', { method: options.method, body: options.body });

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    console.log('🔴 apiRequest - Response status:', response.status);
    
    const data = await response.json();
    console.log('🔴 apiRequest - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ apiRequest - Request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data: any) => 
    apiRequest(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: (endpoint: string, data: any) => 
    apiRequest(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: 'DELETE' }),
};