import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdL5XLoiU8wzAg-HU2G7jGgfeFCA73lTM",
  authDomain: "bolt-2-8d1dd.firebaseapp.com",
  projectId: "bolt-2-8d1dd",
  storageBucket: "bolt-2-8d1dd.appspot.com",
  messagingSenderId: "186532032381",
  appId: "1:186532032381:web:34e9cd43e4346f52872614",
  measurementId: "G-JHX234KESM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName) {
  console.log(`Limpando coleção ${collectionName}...`);
  const querySnapshot = await getDocs(collection(db, collectionName));
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`Coleção ${collectionName} limpa com sucesso!`);
}

async function clearDatabase() {
  try {
    console.log('Iniciando limpeza do banco de dados...');
    console.log('ATENÇÃO: Apenas as coleções "machines" e "categorias" serão limpas.');
    console.log('Outros dados do banco de dados serão mantidos intactos.');
    
    await clearCollection('machines');
    await clearCollection('categorias');
    
    console.log('Limpeza concluída com sucesso!');
    console.log('As coleções "machines" e "categorias" foram resetadas.');
    console.log('Você pode agora executar o script new-seed.mjs para recriar os dados.');
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
  }
}

clearDatabase();
