import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Address } from '@/types/auth';

const ADDRESSES_COLLECTION = 'addresses';

export const addressService = {
  async getUserAddresses(userId: string): Promise<Address[]> {
    const addressesRef = collection(db, ADDRESSES_COLLECTION);
    const q = query(addressesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      userId, // Garantir que o userId está presente
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Address));
  },

  async addAddress(userId: string, address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    const addressesRef = collection(db, ADDRESSES_COLLECTION);
    const newAddressRef = doc(addressesRef);
    
    const newAddress: Address = {
      ...address,
      id: newAddressRef.id,
      userId, // Incluir userId no objeto do endereço
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(newAddressRef, {
      ...newAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return newAddress;
  },

  async updateAddress(userId: string, address: Partial<Address> & { id: string }): Promise<void> {
    const addressRef = doc(db, ADDRESSES_COLLECTION, address.id);
    await setDoc(addressRef, {
      ...address,
      userId, // Garantir que o userId está presente
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  async deleteAddress(addressId: string): Promise<void> {
    const addressRef = doc(db, ADDRESSES_COLLECTION, addressId);
    await deleteDoc(addressRef);
  },

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    // Primeiro, remove o status de padrão de todos os endereços do usuário
    const addresses = await this.getUserAddresses(userId);
    const updatePromises = addresses.map(address => 
      this.updateAddress(userId, { 
        id: address.id, 
        isDefault: address.id === addressId,
        updatedAt: new Date()
      })
    );
    await Promise.all(updatePromises);
  }
};
