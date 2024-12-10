import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Carrega as credenciais do arquivo JSON
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json')
);

// Inicializa o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ID do proprietário das máquinas
const OWNER_ID = 'BU0nNFx2vuZXtPnOmPeG4ngcECk1';

// Função para gerar preço aleatório entre min e max
const randomPrice = (min, max) => 
  Math.floor(Math.random() * (max - min + 1) + min);

// Função para adicionar uma máquina
const addMachine = async (machineData) => {
  try {
    const docRef = await db.collection('machines').add({
      ...machineData,
      ownerId: OWNER_ID,
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    });
    console.log('Máquina adicionada com ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Erro ao adicionar máquina:', error);
    throw error;
  }
};

// Arrays de máquinas (mesmo conteúdo do script anterior)
const workTypeMachines = [
  {
    name: 'Escavadeira Hidráulica CAT 320',
    category: 'tipos-trabalho',
    subcategory: 'Escavação',
    workPhase: 'Fundação',
    shortDescription: 'Escavadeira de grande porte para trabalhos pesados',
    longDescription: 'Escavadeira hidráulica ideal para grandes obras, com capacidade de escavação profunda e alta produtividade.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fescavadeira-cat.jpg',
    pricePerDay: randomPrice(800, 1200)
  },
  // ... (resto das máquinas igual ao script anterior)
];

const constructionPhaseMachines = [
  // ... (mesmo conteúdo do script anterior)
];

const applicationMachines = [
  // ... (mesmo conteúdo do script anterior)
];

// Função principal para adicionar todas as máquinas
const seedMachines = async () => {
  try {
    console.log('Iniciando seed de máquinas...');

    // Adiciona máquinas por tipo de trabalho
    for (const machine of workTypeMachines) {
      await addMachine(machine);
    }

    // Adiciona máquinas por fase da obra
    for (const machine of constructionPhaseMachines) {
      await addMachine(machine);
    }

    // Adiciona máquinas por aplicação
    for (const machine of applicationMachines) {
      await addMachine(machine);
    }

    console.log('Seed de máquinas concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed de máquinas:', error);
    process.exit(1);
  }
};

// Executa o seed
seedMachines();
