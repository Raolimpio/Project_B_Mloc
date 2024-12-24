import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    console.log('Iniciando upload...', { fileName: file.name, path });
    
    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fullPath = `${path}/${fileName}`;
    
    console.log('Caminho completo:', fullPath);
    
    const storageRef = ref(storage, fullPath);
    console.log('Fazendo upload...');
    const snapshot = await uploadBytes(storageRef, file);
    
    console.log('Upload concluído, obtendo URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('URL obtida:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Erro detalhado ao fazer upload:', error);
    throw new Error('Erro ao fazer upload da imagem');
  }
}
