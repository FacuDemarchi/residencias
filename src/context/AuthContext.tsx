import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface UserData {
  id: number;
  user_id: string;
  user_type: 'cliente' | 'residencia';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userData: UserData | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  async function fetchUserData(user: User) {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } else {
        // Validar que el user_type sea válido
        if (data && (data.user_type === 'cliente' || data.user_type === 'residencia')) {
          setUserData(data);
        } else {
          console.error('Invalid user_type:', data?.user_type);
          setUserData(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        localStorage.setItem('user', JSON.stringify(data.session.user));
        fetchUserData(data.session.user);
      } else {
        localStorage.removeItem('user');
        setUserData(null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('user', JSON.stringify(session.user));
        fetchUserData(session.user);
      } else {
        localStorage.removeItem('user');
        setUserData(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Definir redirectTo según variable de entorno o window.location.origin
  const redirectTo = import.meta.env.VITE_REDIRECT_URL || window.location.origin;

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserData(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userData,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}; 