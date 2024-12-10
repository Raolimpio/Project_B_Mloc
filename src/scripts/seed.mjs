import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuIBxMvp6SQZwWZRCcH2RNccELgOHQrxw",
  authDomain: "mariloc-dev.firebaseapp.com",
  projectId: "mariloc-dev",
  storageBucket: "mariloc-dev.appspot.com",
  messagingSenderId: "1063581391906",
  appId: "1:1063581391906:web:9c0e61fdb2a0a0a6fc0e4b",
  measurementId: "G-K6VCCX4WNY"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID do proprietário das máquinas
const OWNER_ID = 'BU0nNFx2vuZXtPnOmPeG4ngcECk1';

// Função para gerar preço aleatório entre min e max
const randomPrice = (min, max) => 
  Math.floor(Math.random() * (max - min + 1) + min);

// Função para adicionar uma máquina
const addMachine = async (machineData) => {
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fescavadeira-cat.jpg',
    pricePerDay: randomPrice(800, 1200)
  },
  {
    name: 'Retroescavadeira JCB 3CX',
    category: 'tipos-trabalho',
    subcategory: 'Terraplanagem',
    workPhase: 'Fundação',
    shortDescription: 'Retroescavadeira versátil para múltiplas aplicações',
    longDescription: 'Máquina versátil que combina as funções de carregadeira frontal e escavadeira traseira.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fretroescavadeira.jpg',
    pricePerDay: randomPrice(500, 800)
  },
  {
    name: 'Rolo Compactador CAT CS533E',
    category: 'tipos-trabalho',
    subcategory: 'Compactação',
    workPhase: 'Terraplanagem',
    shortDescription: 'Rolo compactador para grandes áreas',
    longDescription: 'Rolo compactador vibratório para compactação de solo em grandes áreas.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Frolo-compactador.jpg',
    pricePerDay: randomPrice(600, 900)
  },
  {
    name: 'Caminhão Basculante Volvo',
    category: 'tipos-trabalho',
    subcategory: 'Transporte',
    workPhase: 'Terraplanagem',
    shortDescription: 'Caminhão basculante para transporte de material',
    longDescription: 'Caminhão basculante com capacidade de 12m³ para transporte de terra e entulho.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fcaminhao-basculante.jpg',
    pricePerDay: randomPrice(700, 1000)
  },
  {
    name: 'Martelo Demolidor Hidráulico',
    category: 'tipos-trabalho',
    subcategory: 'Demolição',
    workPhase: 'Demolição',
    shortDescription: 'Martelo demolidor para trabalhos pesados',
    longDescription: 'Martelo demolidor hidráulico para quebra de concreto e rochas.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fmartelo-demolidor.jpg',
    pricePerDay: randomPrice(400, 600)
  }
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fbetoneira.jpg',
    pricePerDay: randomPrice(100, 200)
  },
  {
    name: 'Vibrador de Concreto',
    category: 'fases-obra',
    subcategory: 'Estrutura',
    workPhase: 'Estrutura e alvenaria',
    shortDescription: 'Vibrador para adensamento de concreto',
    longDescription: 'Vibrador de concreto profissional para garantir a qualidade do concreto em estruturas.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fvibrador-concreto.jpg',
    pricePerDay: randomPrice(80, 150)
  },
  {
    name: 'Andaime Fachadeiro',
    category: 'fases-obra',
    subcategory: 'Acabamento',
    workPhase: 'Acabamento',
    shortDescription: 'Andaime para trabalhos em fachada',
    longDescription: 'Conjunto de andaime fachadeiro com plataformas e guarda-corpo.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fandaime.jpg',
    pricePerDay: randomPrice(200, 400)
  },
  {
    name: 'Serra Circular de Bancada',
    category: 'fases-obra',
    subcategory: 'Estrutura',
    workPhase: 'Estrutura e alvenaria',
    shortDescription: 'Serra circular profissional',
    longDescription: 'Serra circular de bancada para corte preciso de madeiras e derivados.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fserra-circular.jpg',
    pricePerDay: randomPrice(150, 300)
  },
  {
    name: 'Gerador 100 KVA',
    category: 'fases-obra',
    subcategory: 'Infraestrutura',
    workPhase: 'Canteiro de obras',
    shortDescription: 'Gerador de energia diesel',
    longDescription: 'Gerador de energia a diesel para alimentação do canteiro de obras.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fgerador.jpg',
    pricePerDay: randomPrice(500, 800)
  }
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
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fbobcat.jpg',
    pricePerDay: randomPrice(400, 600)
  },
  {
    name: 'Plataforma Elevatória Tesoura',
    category: 'aplicacoes',
    subcategory: 'Comercial',
    workPhase: 'Acabamento',
    shortDescription: 'Plataforma elevatória tipo tesoura',
    longDescription: 'Plataforma elevatória ideal para trabalhos em altura em ambientes internos e externos.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fplataforma-tesoura.jpg',
    pricePerDay: randomPrice(300, 500)
  },
  {
    name: 'Empilhadeira 2.5T',
    category: 'aplicacoes',
    subcategory: 'Industrial',
    workPhase: 'Logística',
    shortDescription: 'Empilhadeira para movimentação de cargas',
    longDescription: 'Empilhadeira a diesel com capacidade de 2.5 toneladas para movimentação de materiais.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fempilhadeira.jpg',
    pricePerDay: randomPrice(400, 700)
  },
  {
    name: 'Guindaste 30T',
    category: 'aplicacoes',
    subcategory: 'Industrial',
    workPhase: 'Montagem',
    shortDescription: 'Guindaste para cargas pesadas',
    longDescription: 'Guindaste sobre caminhão com capacidade de 30 toneladas para içamento de cargas.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Fguindaste.jpg',
    pricePerDay: randomPrice(1500, 2000)
  },
  {
    name: 'Rompedor Hidráulico',
    category: 'aplicacoes',
    subcategory: 'Infraestrutura',
    workPhase: 'Demolição',
    shortDescription: 'Rompedor para trabalhos pesados',
    longDescription: 'Rompedor hidráulico para quebra de rochas e concreto em obras de infraestrutura.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mariloc-dev.appspot.com/o/machines%2Frompedor.jpg',
    pricePerDay: randomPrice(600, 900)
  }
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
