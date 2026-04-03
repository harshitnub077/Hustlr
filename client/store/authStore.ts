import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface UserProfile {
  bio?: string;
  skills?: string[];
  avatarUrl?: string;
  premiumBadge?: boolean;
  location?: string;
  linkedIn?: string;
  github?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  isVerified: boolean;
  isApprovedByAdmin: boolean;
  profile: UserProfile;
  averageRating?: number;
  totalReviews?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'company';
  collegeDetails?: { collegeName: string; eduEmail: string };
  companyDetails?: { companyName: string; website?: string };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', formData);
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'hustlr_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
