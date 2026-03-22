'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get a fresh access token via refresh cookie
        const { data: refreshData } = await api.post('/auth/refresh', {});
        const token = refreshData.accessToken;
        Cookies.set('accessToken', token, { expires: 1 / 96 }); // 15 mins

        // Fetch full user profile
        const { data: meData } = await api.get('/auth/me');
        setUser(meData.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
