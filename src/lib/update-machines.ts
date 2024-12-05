import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function updateAllMachinesOwner(newOwnerId: string) {
  try {
    console.log('Starting machines ownership update...');
    const machinesRef = collection(db, 'machines');
    const querySnapshot = await getDocs(machinesRef);
    
    const batch = writeBatch(db);
    let updateCount = 0;

    querySnapshot.docs.forEach((docSnapshot) => {
      const machineRef = doc(db, 'machines', docSnapshot.id);
      batch.update(machineRef, {
        ownerId: newOwnerId,
        updatedAt: serverTimestamp()
      });
      updateCount++;
    });

    await batch.commit();
    console.log(`Successfully updated ${updateCount} machines to owner: ${newOwnerId}`);
    return updateCount;
  } catch (error) {
    console.error('Error updating machines ownership:', error);
    throw error;
  }
}