import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-GEEbZMVVCkgxDwvuQwBFAhYkXJZHNc4",
  authDomain: "bolt-2-8d1dd.firebaseapp.com",
  projectId: "bolt-2-8d1dd",
  storageBucket: "bolt-2-8d1dd.appspot.com",
  messagingSenderId: "1043831776937",
  appId: "1:1043831776937:web:c8d2c4d6a2c0d7e2f5a8d0"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Categorias principais
const CATEGORIAS = [
  {
    id: "cat-tipos-trabalho",
    nome: "Tipos de Trabalho",
    descricao: "Categorias baseadas no tipo de trabalho realizado pelo equipamento",
    descricaoBreve: "Classificação por função",
    bannerCategoria: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    iconeCategoria: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    subcategorias: [
      {
        id: "escavacao",
        nome: "Escavação",
        descricao: "Equipamentos para escavação e movimentação de terra",
        descricaoBreve: "Escavação de terra",
        bannerCategoria: "https://images.unsplash.com/photo-escavacao",
        iconeCategoria: "https://images.unsplash.com/photo-escavacao-icon"
      },
      {
        id: "terraplanagem",
        nome: "Terraplanagem",
        descricao: "Máquinas para nivelamento e preparação de terrenos",
        descricaoBreve: "Nivelamento de terrenos",
        bannerCategoria: "https://images.unsplash.com/photo-terraplanagem",
        iconeCategoria: "https://images.unsplash.com/photo-terraplanagem-icon"
      },
      {
        id: "demolicao",
        nome: "Demolição",
        descricao: "Equipamentos para demolição controlada",
        descricaoBreve: "Demolição de estruturas",
        bannerCategoria: "https://images.unsplash.com/photo-demolicao",
        iconeCategoria: "https://images.unsplash.com/photo-demolicao-icon"
      },
      {
        id: "compactacao",
        nome: "Compactação",
        descricao: "Máquinas para compactação de solo",
        descricaoBreve: "Compactação de solo",
        bannerCategoria: "https://images.unsplash.com/photo-compactacao",
        iconeCategoria: "https://images.unsplash.com/photo-compactacao-icon"
      },
      {
        id: "transporte",
        nome: "Transporte",
        descricao: "Veículos para transporte de materiais",
        descricaoBreve: "Transporte de materiais",
        bannerCategoria: "https://images.unsplash.com/photo-transporte",
        iconeCategoria: "https://images.unsplash.com/photo-transporte-icon"
      }
    ]
  },
  {
    id: "cat-fases-obra",
    nome: "Fases da Obra",
    descricao: "Categorias baseadas nas diferentes etapas de uma construção",
    descricaoBreve: "Etapas da construção",
    bannerCategoria: "https://images.unsplash.com/photo-fases",
    iconeCategoria: "https://images.unsplash.com/photo-fases-icon",
    subcategorias: [
      {
        id: "fundacao",
        nome: "Fundação",
        descricao: "Equipamentos para a fase de fundação",
        descricaoBreve: "Fase inicial",
        bannerCategoria: "https://images.unsplash.com/photo-fundacao",
        iconeCategoria: "https://images.unsplash.com/photo-fundacao-icon"
      },
      {
        id: "infraestrutura",
        nome: "Infraestrutura",
        descricao: "Máquinas para infraestrutura básica",
        descricaoBreve: "Infraestrutura básica",
        bannerCategoria: "https://images.unsplash.com/photo-infra",
        iconeCategoria: "https://images.unsplash.com/photo-infra-icon"
      },
      {
        id: "estrutura",
        nome: "Estrutura",
        descricao: "Equipamentos para fase estrutural",
        descricaoBreve: "Fase estrutural",
        bannerCategoria: "https://images.unsplash.com/photo-estrutura",
        iconeCategoria: "https://images.unsplash.com/photo-estrutura-icon"
      },
      {
        id: "acabamento",
        nome: "Acabamento",
        descricao: "Máquinas para acabamento",
        descricaoBreve: "Fase de acabamento",
        bannerCategoria: "https://images.unsplash.com/photo-acabamento",
        iconeCategoria: "https://images.unsplash.com/photo-acabamento-icon"
      },
      {
        id: "manutencao",
        nome: "Manutenção",
        descricao: "Equipamentos para manutenção",
        descricaoBreve: "Manutenção geral",
        bannerCategoria: "https://images.unsplash.com/photo-manutencao",
        iconeCategoria: "https://images.unsplash.com/photo-manutencao-icon"
      }
    ]
  },
  {
    id: "cat-aplicacao",
    nome: "Aplicação",
    descricao: "Categorias baseadas no tipo de aplicação do equipamento",
    descricaoBreve: "Tipo de uso",
    bannerCategoria: "https://images.unsplash.com/photo-aplicacao",
    iconeCategoria: "https://images.unsplash.com/photo-aplicacao-icon",
    subcategorias: [
      {
        id: "construcao-civil",
        nome: "Construção Civil",
        descricao: "Equipamentos para construção civil",
        descricaoBreve: "Obras civis",
        bannerCategoria: "https://images.unsplash.com/photo-civil",
        iconeCategoria: "https://images.unsplash.com/photo-civil-icon"
      },
      {
        id: "mineracao",
        nome: "Mineração",
        descricao: "Máquinas para mineração",
        descricaoBreve: "Operações de mineração",
        bannerCategoria: "https://images.unsplash.com/photo-mineracao",
        iconeCategoria: "https://images.unsplash.com/photo-mineracao-icon"
      },
      {
        id: "industrial",
        nome: "Industrial",
        descricao: "Equipamentos para uso industrial",
        descricaoBreve: "Uso industrial",
        bannerCategoria: "https://images.unsplash.com/photo-industrial",
        iconeCategoria: "https://images.unsplash.com/photo-industrial-icon"
      },
      {
        id: "residencial",
        nome: "Residencial",
        descricao: "Máquinas para uso residencial",
        descricaoBreve: "Obras residenciais",
        bannerCategoria: "https://images.unsplash.com/photo-residencial",
        iconeCategoria: "https://images.unsplash.com/photo-residencial-icon"
      },
      {
        id: "comercial",
        nome: "Comercial",
        descricao: "Equipamentos para construções comerciais",
        descricaoBreve: "Obras comerciais",
        bannerCategoria: "https://images.unsplash.com/photo-comercial",
        iconeCategoria: "https://images.unsplash.com/photo-comercial-icon"
      }
    ]
  }
];

// Dados comuns para todas as máquinas
const DADOS_COMUNS = {
  proprietarioId: "owner123",
  disponivel: true,
  rating: 4.8,
  localizacao: {
    cidade: "São Paulo",
    estado: "SP",
    coordenadas: {
      lat: -23.550520,
      lng: -46.633308
    }
  }
};

// Função principal para fazer o seed dos dados
async function seedTestData() {
  console.log('Iniciando seed de dados de teste...');
  
  try {
    console.log('Salvando categorias...');
    for (const categoria of CATEGORIAS) {
      await setDoc(doc(db, 'categorias', categoria.id), categoria);
      console.log(`Categoria salva: ${categoria.nome}`);
    }

    console.log('Salvando máquinas...');
    // Aqui vamos adicionar o código para salvar as máquinas
    // Por enquanto só uma máquina de exemplo
    const maquinaExemplo = {
      id: 'machine-001',
      nome: 'Escavadeira Hidráulica XL2000',
      descricao: 'Escavadeira hidráulica com capacidade de 2 toneladas',
      descricaoBreve: 'Escavadeira 2t',
      categorias: {
        tipoTrabalho: ['escavacao'],
        faseDaObra: ['fundacao'],
        aplicacao: ['construcao-civil']
      },
      imagemProduto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
      videoProduto: 'https://youtube.com/watch?v=abc123',
      precoPromocional: 1200.00,
      ...DADOS_COMUNS
    };

    await setDoc(doc(db, 'maquinas', maquinaExemplo.id), maquinaExemplo);
    console.log(`Máquina salva: ${maquinaExemplo.nome}`);

    console.log('Seed de dados concluído!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  }
}

// Executa o seed
seedTestData();
