import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

// Estrutura de categorias
const CATEGORIES = {
  // Tipos de Trabalho
  tiposTrabalho: {
    id: 'cat-tipos-trabalho',
    nome: 'Tipos de Trabalho',
    tipo: 'grupo',
    descricao: 'Categorias baseadas no tipo de trabalho realizado',
    bannerUrl: '/images/categories/tipos-trabalho-banner.jpg',
    iconeUrl: '/images/categories/tipos-trabalho-icon.jpg',
    subcategorias: [
      {
        id: 'cat-escavacao',
        nome: 'Escavação',
        tipo: 'tipoTrabalho',
        descricao: 'Máquinas para escavação e movimentação de terra',
        bannerUrl: '/images/categories/escavacao-banner.jpg',
        iconeUrl: '/images/categories/escavacao-icon.jpg',
        ordem: 1
      },
      {
        id: 'cat-terraplanagem',
        nome: 'Terraplanagem',
        tipo: 'tipoTrabalho',
        descricao: 'Máquinas para nivelamento e preparação de terreno',
        bannerUrl: '/images/categories/terraplanagem-banner.jpg',
        iconeUrl: '/images/categories/terraplanagem-icon.jpg',
        ordem: 2
      },
      {
        id: 'cat-pavimentacao',
        nome: 'Pavimentação',
        tipo: 'tipoTrabalho',
        descricao: 'Máquinas para pavimentação e acabamento',
        bannerUrl: '/images/categories/pavimentacao-banner.jpg',
        iconeUrl: '/images/categories/pavimentacao-icon.jpg',
        ordem: 3
      },
      {
        id: 'cat-elevacao',
        nome: 'Elevação',
        tipo: 'tipoTrabalho',
        descricao: 'Máquinas para elevação e movimentação vertical',
        bannerUrl: '/images/categories/elevacao-banner.jpg',
        iconeUrl: '/images/categories/elevacao-icon.jpg',
        ordem: 4
      },
      {
        id: 'cat-compactacao',
        nome: 'Compactação',
        tipo: 'tipoTrabalho',
        descricao: 'Máquinas para compactação de solo',
        bannerUrl: '/images/categories/compactacao-banner.jpg',
        iconeUrl: '/images/categories/compactacao-icon.jpg',
        ordem: 5
      }
    ]
  },
  
  // Fases da Obra
  fasesDaObra: {
    id: 'cat-fases-obra',
    nome: 'Fases da Obra',
    tipo: 'grupo',
    descricao: 'Categorias baseadas na fase da construção',
    bannerUrl: '/images/categories/fases-obra-banner.jpg',
    iconeUrl: '/images/categories/fases-obra-icon.jpg',
    subcategorias: [
      {
        id: 'cat-fundacao',
        nome: 'Fundação',
        tipo: 'faseObra',
        descricao: 'Máquinas para a fase de fundação',
        bannerUrl: '/images/categories/fundacao-banner.jpg',
        iconeUrl: '/images/categories/fundacao-icon.jpg',
        ordem: 1
      },
      {
        id: 'cat-estrutura',
        nome: 'Estrutura',
        tipo: 'faseObra',
        descricao: 'Máquinas para a fase estrutural',
        bannerUrl: '/images/categories/estrutura-banner.jpg',
        iconeUrl: '/images/categories/estrutura-icon.jpg',
        ordem: 2
      },
      {
        id: 'cat-acabamento',
        nome: 'Acabamento',
        tipo: 'faseObra',
        descricao: 'Máquinas para a fase de acabamento',
        bannerUrl: '/images/categories/acabamento-banner.jpg',
        iconeUrl: '/images/categories/acabamento-icon.jpg',
        ordem: 3
      },
      {
        id: 'cat-infraestrutura',
        nome: 'Infraestrutura',
        tipo: 'faseObra',
        descricao: 'Máquinas para trabalhos de infraestrutura',
        bannerUrl: '/images/categories/infraestrutura-banner.jpg',
        iconeUrl: '/images/categories/infraestrutura-icon.jpg',
        ordem: 4
      }
    ]
  },

  // Tipos de Aplicação
  aplicacoes: {
    id: 'cat-aplicacoes',
    nome: 'Aplicações',
    tipo: 'grupo',
    descricao: 'Categorias baseadas no tipo de aplicação',
    bannerUrl: '/images/categories/aplicacoes-banner.jpg',
    iconeUrl: '/images/categories/aplicacoes-icon.jpg',
    subcategorias: [
      {
        id: 'cat-construcao-civil',
        nome: 'Construção Civil',
        tipo: 'aplicacao',
        descricao: 'Máquinas para construção civil em geral',
        bannerUrl: '/images/categories/construcao-civil-banner.jpg',
        iconeUrl: '/images/categories/construcao-civil-icon.jpg',
        ordem: 1
      },
      {
        id: 'cat-mineracao',
        nome: 'Mineração',
        tipo: 'aplicacao',
        descricao: 'Máquinas para trabalhos em mineração',
        bannerUrl: '/images/categories/mineracao-banner.jpg',
        iconeUrl: '/images/categories/mineracao-icon.jpg',
        ordem: 2
      },
      {
        id: 'cat-agricultura',
        nome: 'Agricultura',
        tipo: 'aplicacao',
        descricao: 'Máquinas para uso agrícola',
        bannerUrl: '/images/categories/agricultura-banner.jpg',
        iconeUrl: '/images/categories/agricultura-icon.jpg',
        ordem: 3
      },
      {
        id: 'cat-industria',
        nome: 'Indústria',
        tipo: 'aplicacao',
        descricao: 'Máquinas para uso industrial',
        bannerUrl: '/images/categories/industria-banner.jpg',
        iconeUrl: '/images/categories/industria-icon.jpg',
        ordem: 4
      }
    ]
  }
};

// Estrutura de máquinas
const MACHINES = [
  {
    id: 'escavadeira-cat-320',
    nome: 'Escavadeira CAT 320',
    marca: 'Caterpillar',
    modelo: '320',
    ano: 2022,
    descricao: 'Escavadeira hidráulica de última geração, ideal para trabalhos de fundação e escavação em obras de construção civil',
    descricaoBreve: 'Escavadeira hidráulica potente e versátil',
    especificacoes: {
      peso: '20.000 kg',
      potencia: '162 hp',
      capacidadeCacamba: '1.19 m³'
    },
    // Uma máquina pode estar em múltiplas categorias de diferentes grupos
    categorias: [
      // Tipo de Trabalho
      'cat-escavacao',
      // Fase da Obra
      'cat-fundacao',
      // Aplicação
      'cat-construcao-civil'
    ],
    imagemProduto: 'https://example.com/cat-320.jpg',
    precoBase: 1500,
    precoPromocional: 1200,
    disponibilidade: true,
    destaque: true
  },
  {
    id: 'motoniveladora-cat-120',
    nome: 'Motoniveladora CAT 120',
    marca: 'Caterpillar',
    modelo: '120',
    ano: 2021,
    descricao: 'Motoniveladora para terraplanagem precisa',
    descricaoBreve: 'Motoniveladora de alta precisão',
    especificacoes: {
      peso: '13.032 kg',
      potencia: '125 hp',
      larguraLamina: '3.7 m'
    },
    categorias: ['cat-terraplanagem'],
    imagemProduto: 'https://example.com/cat-120.jpg',
    precoBase: 1200,
    precoPromocional: 1000,
    disponibilidade: true,
    destaque: false
  }
];

// Função para salvar categorias
async function seedCategories() {
  console.log('Iniciando seed de categorias...');
  
  // Salvar grupos principais
  for (const groupKey of Object.keys(CATEGORIES)) {
    const group = CATEGORIES[groupKey];
    
    // Salvar grupo
    await setDoc(doc(db, 'categorias', group.id), {
      nome: group.nome,
      tipo: group.tipo,
      descricao: group.descricao,
      bannerUrl: group.bannerUrl,
      iconeUrl: group.iconeUrl
    });
    
    // Salvar subcategorias
    for (const subcat of group.subcategorias) {
      await setDoc(doc(db, 'categorias', subcat.id), {
        nome: subcat.nome,
        tipo: subcat.tipo,
        descricao: subcat.descricao,
        bannerUrl: subcat.bannerUrl,
        iconeUrl: subcat.iconeUrl,
        ordem: subcat.ordem,
        grupoPai: group.id
      });
    }
  }
  
  console.log('Categorias salvas com sucesso!');
}

// Função para salvar máquinas
async function seedMachines() {
  console.log('Iniciando seed de máquinas...');
  
  for (const machine of MACHINES) {
    await setDoc(doc(db, 'machines', machine.id), machine);
  }
  
  console.log('Máquinas salvas com sucesso!');
}

// Função principal
async function seedAll() {
  try {
    await seedCategories();
    await seedMachines();
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  }
}

// Executar seed
seedAll();
