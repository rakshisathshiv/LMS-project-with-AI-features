'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/store/useAuth';
import Cookies from 'js-cookie';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to hit an auth-protected route or use refresh to get a new token 
        // if cookie is present. Wait, we don't have a /me route. 
        // Let's just blindly refresh.
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        if (res.data.accessToken) {
          const token = res.data.accessToken;
          Cookies.set('accessToken', token, { expires: 1/96 });
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: payload.id, email: payload.email, name: payload.name || 'User' });
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
