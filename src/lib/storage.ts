import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { compressImage, validateImage } from './image-utils';
import { STORAGE_PATHS } from './storage-config';
import Logger from './logger';

// Machine Images
export async function uploadMachineImage(machineId: string, file: File): Promise<string> {
  try {
    validateImage(file);
    Logger.info('Starting machine image upload', { machineId, fileName: file.name });
    
    const compressedFile = await compressImage(file);
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${STORAGE_PATHS.machines}/${machineId}/${timestamp}-${sanitizedFilename}`;
    
    Logger.info('Uploading to path', { path });
    
    const imageRef = ref(storage, path);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        machineId,
        uploadedAt: timestamp.toString()
      }
    };
    
    const snapshot = await uploadBytes(imageRef, compressedFile, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    Logger.info('Upload successful', { downloadUrl });
    return downloadUrl;
  } catch (error) {
    Logger.error('Upload failed', error as Error, { machineId });
    throw error; // Preserve original error for better debugging
  }
}

export async function deleteMachineImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;
  
  try {
    Logger.info('Deleting machine image', { imageUrl });
    const decodedUrl = decodeURIComponent(imageUrl);
    const path = decodedUrl.split('/o/')[1].split('?')[0];
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    Logger.info('Image deleted successfully');
  } catch (error) {
    Logger.error('Delete failed', error as Error);
    throw error; // Preserve original error for better debugging
  }
}

// Banner Images
export async function uploadBannerImage(file: File): Promise<string> {
  try {
    validateImage(file);
    const compressedFile = await compressImage(file);
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${STORAGE_PATHS.banners}/${timestamp}-${sanitizedFilename}`;
    
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, compressedFile);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    Logger.error('Banner upload failed', error as Error);
    throw error;
  }
}

// Category Images
export async function uploadCategoryImage(categoryId: string, file: File): Promise<string> {
  try {
    validateImage(file);
    const compressedFile = await compressImage(file);
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${STORAGE_PATHS.categories}/${categoryId}/${timestamp}-${sanitizedFilename}`;
    
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, compressedFile);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    Logger.error('Category image upload failed', error as Error);
    throw error;
  }
}

// User Avatars
export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
  try {
    validateImage(file);
    const compressedFile = await compressImage(file);
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${STORAGE_PATHS.avatars}/${userId}/${timestamp}-${sanitizedFilename}`;
    
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, compressedFile);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    Logger.error('Avatar upload failed', error as Error);
    throw error;
  }
}

export async function deleteUserAvatar(userId: string): Promise<void> {
  try {
    Logger.info('Deleting user avatar', { userId });
    const path = `${STORAGE_PATHS.avatars}/${userId}`;
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    Logger.info('Avatar deleted successfully');
  } catch (error) {
    // Ignore error if avatar doesn't exist
    if ((error as any)?.code !== 'storage/object-not-found') {
      Logger.error('Avatar delete failed', error as Error);
      throw error;
    }
  }
}