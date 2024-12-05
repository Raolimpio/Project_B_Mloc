import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { compressImage } from './image-utils';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}

export async function uploadImage(
  file: File,
  path: string,
  options?: UploadOptions
): Promise<string> {
  try {
    console.log('Iniciando upload da imagem:', { fileName: file.name, path });

    // Comprimir imagem antes do upload
    const compressedFile = await compressImage(file);
    console.log('Imagem comprimida com sucesso');
    
    // Criar referência no storage
    const storageRef = ref(storage, path);
    console.log('Referência do storage criada:', path);
    
    // Iniciar upload com progresso
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Progresso do upload:', progress);
          options?.onProgress?.(progress);
        },
        (error) => {
          console.error('Erro durante o upload:', error);
          options?.onError?.(error as Error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload concluído. URL:', downloadUrl);
            options?.onComplete?.(downloadUrl);
            resolve(downloadUrl);
          } catch (error) {
            console.error('Erro ao obter URL de download:', error);
            options?.onError?.(error as Error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Erro ao preparar upload:', error);
    options?.onError?.(error as Error);
    throw error;
  }
}