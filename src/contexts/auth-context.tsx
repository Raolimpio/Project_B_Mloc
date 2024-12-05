import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/auth';

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log('Auth state changed - User logged in:', user.uid);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const profile = { ...docSnap.data(), uid: user.uid } as UserProfile;
            console.log('User profile loaded:', profile);
            setUserProfile(profile);
          } else {
            console.error('No user profile found for:', user.uid);
            setUserProfile(null);
            setError('Perfil de usuário não encontrado');
          }
        } else {
          console.log('Auth state changed - User logged out');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
        setError('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}