import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Address } from '@/types/auth';

const ADDRESSES_COLLECTION = 'addresses';

export function useAddressManager() {
  const { userProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      const addressesRef = collection(db, ADDRESSES_COLLECTION);
      const q = query(addressesRef, where('userId', '==', userProfile.uid));
      const snapshot = await getDocs(q);
      
      const loadedAddresses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Address));

      setAddresses(loadedAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [userProfile?.uid]);

  const addAddress = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      const addressesRef = collection(db, ADDRESSES_COLLECTION);
      
      // Se não houver endereços, este será o padrão
      const isDefault = addresses.length === 0 ? true : addressData.isDefault;

      const docRef = await addDoc(addressesRef, {
        ...addressData,
        userId: userProfile.uid,
        isDefault,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Se este é o endereço padrão, remove o status de padrão dos outros
      if (isDefault) {
        const updatePromises = addresses
          .filter(addr => addr.isDefault)
          .map(addr => 
            updateDoc(doc(db, ADDRESSES_COLLECTION, addr.id), {
              isDefault: false,
              updatedAt: serverTimestamp()
            })
          );
        
        await Promise.all(updatePromises);
      }

      await loadAddresses();
      return docRef.id;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, addressData: Partial<Address>) => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      const addressRef = doc(db, ADDRESSES_COLLECTION, addressId);

      // Se este endereço está sendo definido como padrão
      if (addressData.isDefault) {
        // Remove o status de padrão dos outros endereços
        const updatePromises = addresses
          .filter(addr => addr.isDefault && addr.id !== addressId)
          .map(addr => 
            updateDoc(doc(db, ADDRESSES_COLLECTION, addr.id), {
              isDefault: false,
              updatedAt: serverTimestamp()
            })
          );
        
        await Promise.all(updatePromises);
      }

      await updateDoc(addressRef, {
        ...addressData,
        updatedAt: serverTimestamp()
      });

      await loadAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      
      // Verifica se é o endereço padrão
      const addressToDelete = addresses.find(addr => addr.id === addressId);
      if (addressToDelete?.isDefault) {
        throw new Error('Não é possível excluir o endereço padrão');
      }

      await deleteDoc(doc(db, ADDRESSES_COLLECTION, addressId));
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      
      // Define este endereço como padrão
      await updateDoc(doc(db, ADDRESSES_COLLECTION, addressId), {
        isDefault: true,
        updatedAt: serverTimestamp()
      });

      // Remove o status de padrão dos outros endereços
      const updatePromises = addresses
        .filter(addr => addr.isDefault && addr.id !== addressId)
        .map(addr => 
          updateDoc(doc(db, ADDRESSES_COLLECTION, addr.id), {
            isDefault: false,
            updatedAt: serverTimestamp()
          })
        );
      
      await Promise.all(updatePromises);
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    loadAddresses
  };
}
