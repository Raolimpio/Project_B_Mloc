import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile } from '@/types/auth';

export async function registerUser(
  email: string, 
  password: string, 
  userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
) {
  try {
    // Criar usuário no Firebase Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Criar perfil no Firestore
    const userProfile: UserProfile = {
      ...userData,
      uid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        zipCode: '',
      }
    };

    // Salvar no Firestore com o mesmo ID do Auth
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return userProfile;
  } catch (error: any) {
    console.error('Erro no registro:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.');
    }
    throw new Error('Erro ao criar conta. Por favor, tente novamente.');
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Autenticar com Firebase Auth
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Buscar perfil no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Perfil de usuário não encontrado');
    }

    return { ...userDoc.data(), uid: user.uid } as UserProfile;
  } catch (error: any) {
    console.error('Erro no login:', error);
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      throw new Error('E-mail ou senha inválidos');
    }
    throw new Error('Erro ao fazer login. Por favor, tente novamente.');
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao fazer logout. Por favor, tente novamente.');
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Verificar se já existe perfil
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Criar perfil básico para novos usuários do Google
      const userProfile: UserProfile = {
        uid: user.uid,
        type: 'individual', // Padrão para login com Google
        email: user.email!,
        fullName: user.displayName || '',
        cpfCnpj: '',
        phone: user.phoneNumber || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
          street: '',
          number: '',
          city: '',
          state: '',
          zipCode: '',
        }
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    }

    return { ...userDoc.data(), uid: user.uid } as UserProfile;
  } catch (error: any) {
    console.error('Erro no login com Google:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login com Google cancelado');
    }
    throw new Error('Erro ao fazer login com Google. Por favor, tente novamente.');
  }
}