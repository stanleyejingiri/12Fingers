//src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;        // ← add this (optional for existing users)
  category: string;
  is_verified: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
   updateUser: (updatedUser: Partial<User>) => void;   // ← add this
};

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => false,
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('🔍 Auth initialization - Token:', !!token, 'User data:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('✅ Auto-login user:', parsedUser.name);
          setUser(parsedUser);
        } catch (error) {
          console.error('❌ Invalid user data, clearing...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      } else {
        console.log('🔒 No valid auth data found');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Login attempt for:', email);
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 Login response:', data);

      if (data.success) {
        // Store user data and token
        localStorage.setItem('user_data', JSON.stringify(data.user));
        localStorage.setItem('auth_token', 'logged-in');
        setUser(data.user);
        console.log('✅ Login successful:', data.user.name);
        return true;
      } else {
        console.error('❌ Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
	// Clear ALL possible storage locations
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refresh');
    // Clear any session storage
    sessionStorage.clear();
    // Reset state
    setUser(null);
    console.log('✅ User logged out completely');
    // Force reload to clear any cached state
    window.location.reload();
  };

	// Then implement it:
	const updateUser = (updatedUser: Partial<User>) => {
	  setUser((prev) => {
		const newUser = { ...prev, ...updatedUser } as User;
		localStorage.setItem('user_data', JSON.stringify(newUser));
		return newUser;
	  });
	};
	
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};