import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (status: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user, token) => {
    Cookies.set('accessToken', token, { expires: 1 / 96 });
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    Cookies.remove('accessToken');
    set({ user: null, isAuthenticated: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
