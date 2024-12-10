import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { MACHINE_CATEGORIES, WORK_PHASES } from '../lib/constants';

const firebaseConfig = {
  // Adicione sua configuração do Firebase aqui
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID do proprietário das máquinas
const OWNER_ID = 'BU0nNFx2vuZXtPnOmPeG4ngcECk1';

// Função para gerar preço aleatório entre min e max
const randomPrice = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1) + min);

// Função para adicionar uma máquina
const addMachine = async (machineData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'machines'), {
      ...machineData,
      ownerId: OWNER_ID,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Máquina adicionada com ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Erro ao adicionar máquina:', error);
    throw error;
  }
};

// Máquinas por tipo de trabalho
const workTypeMachines = [
  {
    name: 'Escavadeira Hidráulica CAT 320',
    category: 'tipos-trabalho',
    subcategory: 'Escavação',
    workPhase: 'Fundação',
    shortDescription: 'Escavadeira de grande porte para trabalhos pesados',
    longDescription: 'Escavadeira hidráulica ideal para grandes obras, com capacidade de escavação profunda e alta produtividade.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/escavadeira-cat-320.jpg',
    pricePerDay: randomPrice(800, 1200)
  },
  {
    name: 'Retroescavadeira JCB 3CX',
    category: 'tipos-trabalho',
    subcategory: 'Escavação',
    workPhase: 'Fundação',
    shortDescription: 'Retroescavadeira versátil para múltiplas aplicações',
    longDescription: 'Máquina versátil que combina as funções de carregadeira frontal e escavadeira traseira.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/retro-jcb-3cx.jpg',
    pricePerDay: randomPrice(500, 800)
  },
  // Adicione mais máquinas aqui...
];

// Máquinas por fase da obra
const constructionPhaseMachines = [
  {
    name: 'Betoneira 400L',
    category: 'fases-obra',
    subcategory: 'Estrutura',
    workPhase: 'Estrutura e alvenaria',
    shortDescription: 'Betoneira profissional para grandes volumes',
    longDescription: 'Betoneira com capacidade de 400 litros, ideal para obras de médio e grande porte.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/betoneira-400l.jpg',
    pricePerDay: randomPrice(100, 200)
  },
  {
    name: 'Vibrador de Concreto',
    category: 'fases-obra',
    subcategory: 'Estrutura',
    workPhase: 'Estrutura e alvenaria',
    shortDescription: 'Vibrador para adensamento de concreto',
    longDescription: 'Vibrador de concreto profissional para garantir a qualidade do concreto em estruturas.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/vibrador-concreto.jpg',
    pricePerDay: randomPrice(80, 150)
  },
  // Adicione mais máquinas aqui...
];

// Máquinas por aplicação
const applicationMachines = [
  {
    name: 'Mini Carregadeira Bob Cat',
    category: 'aplicacoes',
    subcategory: 'Residencial',
    workPhase: 'Terraplanagem',
    shortDescription: 'Mini carregadeira compacta e versátil',
    longDescription: 'Ideal para trabalhos em espaços reduzidos, com grande versatilidade de implementos.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/bobcat.jpg',
    pricePerDay: randomPrice(400, 600)
  },
  {
    name: 'Plataforma Elevatória Tesoura',
    category: 'aplicacoes',
    subcategory: 'Comercial',
    workPhase: 'Acabamento',
    shortDescription: 'Plataforma elevatória tipo tesoura',
    longDescription: 'Plataforma elevatória ideal para trabalhos em altura em ambientes internos e externos.',
    imageUrl: 'https://firebasestorage.googleapis.com/[sua-url]/plataforma-tesoura.jpg',
    pricePerDay: randomPrice(300, 500)
  },
  // Adicione mais máquinas aqui...
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
  } catch (error) {
    console.error('Erro durante o seed de máquinas:', error);
  }
};

// Executa o seed
seedMachines();
