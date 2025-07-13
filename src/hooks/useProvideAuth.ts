import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Puedes tipar userData si lo usas
// type UserData = { ... };

export function useProvideAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // const [userData, setUserData] = useState<UserData | null>(null);

  // async function fetchUserData(user: User) {
  //   // const { data, error } = await supabase.from('user_data').select('*').eq('user_id', user.id);
  //   // setUserData(data?.[0] ?? null);
  // }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        localStorage.setItem('user', JSON.stringify(data.session.user));
        // fetchUserData(data.session.user);
      } else {
        localStorage.removeItem('user');
        // setUserData(null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('user', JSON.stringify(session.user));
        // fetchUserData(session.user);
      } else {
        localStorage.removeItem('user');
        // setUserData(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.removeItem('user');
    // setUserData(null);
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    // userData,
  };
} 