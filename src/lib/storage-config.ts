import { ref, listAll, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import Logger from './logger';

// Base storage path - use the correct bucket URL
const STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/bolt-2-8d1dd.firebasestorage.app';

// Storage structure definition
export const STORAGE_PATHS = {
  machines: `${STORAGE_BASE}/machines`,    // Product images
  banners: `${STORAGE_BASE}/banners`,      // Site banners
  categories: `${STORAGE_BASE}/categories`, // Category images
  avatars: `${STORAGE_BASE}/avatars`,      // User profile photos
  content: `${STORAGE_BASE}/content`,      // General site content
  temp: `${STORAGE_BASE}/temp`             // Temporary files
} as const;

// Initialize storage structure
export async function initializeStorageStructure() {
  try {
    Logger.info('Starting storage structure verification');
    
    // Create a test file to verify permissions
    const testRef = ref(storage, 'test.txt');
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    
    try {
      // Upload test file
      await uploadBytes(testRef, testBlob);
      // Get download URL (isso vai verificar se temos acesso)
      await getDownloadURL(testRef);
      // Deletar arquivo de teste
      await deleteObject(testRef);
      
      Logger.info('Storage access verified successfully');
    } catch (error) {
      Logger.warn('Storage not initialized yet - will be created on first use', { error });
    }

    return true;
  } catch (error) {
    Logger.error('Error verifying storage structure', error as Error);
    return false;
  }
}

// Clean temporary files
export async function cleanupTempFiles() {
  try {
    const tempRef = ref(storage, 'temp');
    const tempFiles = await listAll(tempRef);
    
    const deletePromises = tempFiles.items.map(fileRef => deleteObject(fileRef));
    await Promise.all(deletePromises);

    Logger.info('Temporary files cleaned up successfully');
    return true;
  } catch (error) {
    Logger.error('Error cleaning up temporary files', error as Error);
    return false;
  }
}

// Generate complete file path
export function getStoragePath(folder: keyof typeof STORAGE_PATHS, filename: string): string {
  return `${STORAGE_PATHS[folder]}/${filename}`;
}
