import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import type { UserProfile } from '@/types/auth';

export async function createTestUser() {
  try {
    // Create auth user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      'cliente@teste.com',
      'teste123'
    );

    // Create user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      type: 'individual',
      email: 'cliente@teste.com',
      fullName: 'Cliente Teste',
      cpfCnpj: '123.456.789-00',
      phone: '(11) 98765-4321',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}