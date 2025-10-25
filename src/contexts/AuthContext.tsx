import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserByEmail, createUser, updateUserProfile, updateUserPassword } from '@/lib/supabaseClient';
import type { User as DbUser } from '@/types/database.types';
import bcrypt from 'bcryptjs';

// Use the same shape as our database user, but without sensitive fields
type User = Omit<DbUser, 'password' | 'created_at' | 'last_login'>;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<console.log>;
  register: (email: string, password: string, name: string, username: string, avatarUrl: string | null) => Promise<console.log>;
  logout: () => Promise<console.log>;
  updateProfile: (data: Partial<User>) => Promise<console.log>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<console.log>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to hash passwords (bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await getUserByEmail(email);
      if (!userData) throw new Error('User not found');

      const passwordHash = userData.password; // our users table stores bcrypt-hashed password in `password`
      const ok = await bcrypt.compare(password, passwordHash);
      if (!ok) throw new Error('Invalid password');

      const profile: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        role: userData.role,
      };

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, username: string, avatarUrl: string | null) => {
    try {
      const hashed = await hashPassword(password);

      const newUser = await createUser({
        username,
        email,
        password: hashed,
        full_name: name || null,
        avatar_url: avatarUrl,
        role: 'user',
      } as any);

      const profile: User = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        bio: newUser.bio,
        role: newUser.role,
      };

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const updates: any = {};
      if (data.username) updates.username = data.username;
      if (data.email) updates.email = data.email;
      if (data.full_name) updates.full_name = data.full_name;
      if (data.avatar_url) updates.avatar_url = data.avatar_url;
      if (data.bio) updates.bio = data.bio;

      const updatedUser = await updateUserProfile(user.id, updates);

      const profile: User = {
        ...user,
        ...updatedUser,
      };

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateUserPassword(user.id, currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
