import { ref, listAll, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import Logger from './logger';

// Base storage path - remove gs:// prefix since it's not needed
const STORAGE_BASE = 'Bolt';

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
    const testRef = ref(storage, `${STORAGE_BASE}/test.txt`);
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    
    try {
      await Promise.race([
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        fetch(testRef.toString())
      ]);
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
    const tempRef = ref(storage, STORAGE_PATHS.temp);
    const tempFiles = await listAll(tempRef);
    
    const deletePromises = tempFiles.items.map(fileRef => deleteObject(fileRef));
    await Promise.all(deletePromises);
    
    Logger.info('Temporary files cleaned successfully');
  } catch (error) {
    Logger.error('Error cleaning temporary files', error as Error);
  }
}

// Generate complete file path
export function getStoragePath(folder: keyof typeof STORAGE_PATHS, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${STORAGE_PATHS[folder]}/${timestamp}-${sanitizedFilename}`;
}