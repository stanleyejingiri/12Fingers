// src/hooks/useAdmin.ts
import { useAuth } from "./useAuth";

// For testing, you can set this to your user ID
const ADMIN_USER_IDS = process.env.NODE_ENV === 'development' 
  ? ['c8008077-f7ab-11f0-b194-8d6e8344ca2c'] // Your user ID
  : []; // Add real admin IDs in production

export function useAdmin() {
  const { user } = useAuth();
  
  const isAdmin = user ? ADMIN_USER_IDS.includes(user.id) : false;
  
  return { isAdmin, user };
}
