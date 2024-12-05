import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { compressImage } from './image-utils';

export type MediaType = 'machine' | 'banner' | 'category' | 'phase' | 'video';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}

export class MediaService {
  private static getStoragePath(type: MediaType, id: string, filename: string): string {
    const timestamp = Date.now();
    switch (type) {
      case 'machine':
        return `machines/${id}/${timestamp}-${filename}`;
      case 'banner':
        return `banners/${timestamp}-${filename}`;
      case 'category':
        return `categories/${timestamp}-${filename}`;
      case 'phase':
        return `phases/${timestamp}-${filename}`;
      case 'video':
        return `videos/${timestamp}-${filename}`;
      default:
        throw new Error('Tipo de mídia inválido');
    }
  }

  static async uploadImage(
    file: File,
    type: MediaType,
    id: string,
    options?: UploadOptions
  ): Promise<string> {
    try {
      // Comprimir imagem
      const compressedFile = await compressImage(file);
      
      // Gerar caminho no storage
      const path = this.getStoragePath(type, id, file.name);
      const storageRef = ref(storage, path);
      
      // Iniciar upload
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            options?.onProgress?.(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            options?.onError?.(error as Error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              options?.onComplete?.(url);
              resolve(url);
            } catch (error) {
              console.error('Error getting download URL:', error);
              options?.onError?.(error as Error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error preparing upload:', error);
      options?.onError?.(error as Error);
      throw error;
    }
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  static async replaceImage(
    oldUrl: string | null,
    newFile: File,
    type: MediaType,
    id: string,
    options?: UploadOptions
  ): Promise<string> {
    try {
      // Primeiro faz upload da nova imagem
      const newUrl = await this.uploadImage(newFile, type, id, options);
      
      // Se houver uma imagem antiga, deleta
      if (oldUrl) {
        await this.deleteImage(oldUrl).catch(console.error);
      }
      
      return newUrl;
    } catch (error) {
      console.error('Error replacing image:', error);
      throw error;
    }
  }
}