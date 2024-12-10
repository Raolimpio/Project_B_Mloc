import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdL5XLoiU8wzAg-HU2G7jGgfeFCA73lTM",
  authDomain: "bolt-2-8d1dd.firebaseapp.com",
  projectId: "bolt-2-8d1dd",
  storageBucket: "bolt-2-8d1dd.appspot.com",
  messagingSenderId: "186532032381",
  appId: "1:186532032381:web:34e9cd43e4346f52872614",
  measurementId: "G-JHX234KESM"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function removerCategoriasDuplicadas() {
  try {
    const categoriasRef = collection(db, 'categorias');
    const snapshot = await getDocs(categoriasRef);
    
    // Encontra todas as categorias que começam com "cat-"
    const categoriasParaRemover = snapshot.docs.filter(doc => doc.id.startsWith('cat-'));
    
    console.log(`Encontradas ${categoriasParaRemover.length} categorias duplicadas para remover...`);
    
    // Remove cada categoria duplicada
    for (const doc of categoriasParaRemover) {
      console.log(`Removendo categoria: ${doc.id}`);
      await deleteDoc(doc.ref);
    }
    
    console.log('Categorias duplicadas removidas com sucesso!');
  } catch (error) {
    console.error('Erro ao remover categorias:', error);
  }
}

// Executa a limpeza
removerCategoriasDuplicadas();
