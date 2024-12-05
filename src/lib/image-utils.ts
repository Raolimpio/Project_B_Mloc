import imageCompression from 'browser-image-compression';
import Logger from './logger';

const MAX_SIZE_MB = 2;
const MAX_WIDTH_PX = 1920;

export async function compressImage(file: File): Promise<File> {
  try {
    Logger.info('Starting image compression', { 
      originalSize: file.size / 1024 / 1024,
      type: file.type 
    });

    const options = {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_WIDTH_PX,
      useWebWorker: true,
      fileType: file.type as string,
    };

    const compressedFile = await imageCompression(file, options);
    
    Logger.info('Image compression complete', {
      originalSize: file.size / 1024 / 1024,
      compressedSize: compressedFile.size / 1024 / 1024,
    });

    return compressedFile;
  } catch (error) {
    Logger.error('Error compressing image', error as Error);
    throw new Error('Failed to compress image');
  }
}

export function validateImage(file: File): void {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported file format. Use JPG, PNG or WebP.');
  }

  // Check file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size: 5MB');
  }
}