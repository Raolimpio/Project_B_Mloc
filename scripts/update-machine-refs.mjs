import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc } from 'firebase/firestore';

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

// Mapeamento das categorias antigas para as novas
const CATEGORY_MAPPING = {
  'tipoTrabalho': 'cat-tipos-trabalho',
  'aplicacao': 'cat-aplicacao'
  // Adicione outros mapeamentos conforme necessário
};

async function atualizarReferencias() {
  try {
    console.log('Iniciando atualização das referências nas máquinas...');
    
    // Busca todas as máquinas
    const machinesRef = collection(db, 'machines');
    const snapshot = await getDocs(machinesRef);
    
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const machine = doc.data();
      let needsUpdate = false;
      const updatedCategories = { ...machine.categorias };
      
      // Verifica cada categoria da máquina
      for (const [oldCat, newCat] of Object.entries(CATEGORY_MAPPING)) {
        if (machine.categorias && machine.categorias[oldCat]) {
          // Copia os dados para a nova categoria
          updatedCategories[newCat] = machine.categorias[oldCat];
          // Remove a categoria antiga
          delete updatedCategories[oldCat];
          needsUpdate = true;
        }
      }
      
      // Atualiza a máquina se necessário
      if (needsUpdate) {
        await updateDoc(doc.ref, { categorias: updatedCategories });
        updatedCount++;
        console.log(`Máquina ${doc.id} atualizada`);
      }
    }
    
    console.log(`Atualização concluída! ${updatedCount} máquinas foram atualizadas.`);
    
  } catch (error) {
    console.error('Erro ao atualizar referências:', error);
  }
}

// Executa a atualização
atualizarReferencias();
