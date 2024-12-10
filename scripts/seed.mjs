import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

// Dados das categorias principais
const CATEGORIES_DATA = {
  tipoTrabalho: [
    {
      nome: "Escavação",
      descricao: "Trabalhos relacionados à movimentação e remoção de terra",
      descricaoBreve: "Movimentação de terra",
      bannerCategoria: "https://images.unsplash.com/photo-excavation-banner",
      iconeCategoria: "https://images.unsplash.com/photo-excavation-icon"
    },
    {
      nome: "Terraplanagem",
      descricao: "Serviços de nivelamento e preparação do terreno",
      descricaoBreve: "Preparação de terreno",
      bannerCategoria: "https://images.unsplash.com/photo-terraplanagem-banner",
      iconeCategoria: "https://images.unsplash.com/photo-terraplanagem-icon"
    }
  ],
  faseDaObra: [
    {
      nome: "Fundação",
      descricao: "Fase inicial da obra, preparação da base",
      descricaoBreve: "Fase inicial",
      bannerCategoria: "https://images.unsplash.com/photo-fundacao-banner",
      iconeCategoria: "https://images.unsplash.com/photo-fundacao-icon"
    },
    {
      nome: "Infraestrutura",
      descricao: "Fase de construção da estrutura básica",
      descricaoBreve: "Estrutura básica",
      bannerCategoria: "https://images.unsplash.com/photo-infraestrutura-banner",
      iconeCategoria: "https://images.unsplash.com/photo-infraestrutura-icon"
    }
  ],
  aplicacao: [
    {
      nome: "Construção Civil",
      descricao: "Aplicações em obras civis e construções",
      descricaoBreve: "Obras civis",
      bannerCategoria: "https://images.unsplash.com/photo-construcao-banner",
      iconeCategoria: "https://images.unsplash.com/photo-construcao-icon"
    },
    {
      nome: "Mineração",
      descricao: "Aplicações em mineração e extração",
      descricaoBreve: "Mineração",
      bannerCategoria: "https://images.unsplash.com/photo-mineracao-banner",
      iconeCategoria: "https://images.unsplash.com/photo-mineracao-icon"
    }
  ]
};

// Dados das máquinas
const MACHINES_DATA = [
  // 5 máquinas específicas para tipoTrabalho
  {
    nome: "Escavadeira Hidráulica CAT320",
    descricao: "Escavadeira hidráulica de última geração para escavações profundas",
    descricaoBreve: "Escavadeira hidráulica 20 toneladas",
    categorias: ["cat-escavacao"],
    imagemProduto: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    precoPromocional: 850.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Trator de Esteira D6",
    descricao: "Trator de esteira para terraplanagem pesada",
    descricaoBreve: "Trator de esteira potente",
    categorias: ["cat-terraplanagem"],
    imagemProduto: "https://images.unsplash.com/photo-trator-esteira",
    precoPromocional: 950.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Rolo Compactador VAP70",
    descricao: "Rolo compactador vibratório para asfalto",
    descricaoBreve: "Rolo compactador profissional",
    categorias: ["cat-pavimentacao"],
    imagemProduto: "https://images.unsplash.com/photo-rolo",
    precoPromocional: 700.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Motoniveladora 140K",
    descricao: "Motoniveladora para nivelamento preciso de terrenos",
    descricaoBreve: "Motoniveladora de precisão",
    categorias: ["cat-nivelamento"],
    imagemProduto: "https://images.unsplash.com/photo-motoniveladora",
    precoPromocional: 800.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Perfuratriz Hidráulica PH1000",
    descricao: "Perfuratriz para fundações profundas",
    descricaoBreve: "Perfuratriz de alta potência",
    categorias: ["cat-perfuracao"],
    imagemProduto: "https://images.unsplash.com/photo-perfuratriz",
    precoPromocional: 1200.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },

  // 5 máquinas específicas para faseDaObra
  {
    nome: "Betoneira 400L",
    descricao: "Betoneira profissional para grandes volumes",
    descricaoBreve: "Betoneira industrial",
    categorias: ["cat-fundacao"],
    imagemProduto: "https://images.unsplash.com/photo-betoneira",
    precoPromocional: 300.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Andaime Fachadeiro",
    descricao: "Andaime completo para fachadas",
    descricaoBreve: "Andaime profissional",
    categorias: ["cat-estrutural"],
    imagemProduto: "https://images.unsplash.com/photo-andaime",
    precoPromocional: 200.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Lixadeira de Parede",
    descricao: "Lixadeira profissional para acabamento",
    descricaoBreve: "Lixadeira industrial",
    categorias: ["cat-acabamento"],
    imagemProduto: "https://images.unsplash.com/photo-lixadeira",
    precoPromocional: 150.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Gerador 100kVA",
    descricao: "Gerador de energia para obra completa",
    descricaoBreve: "Gerador industrial",
    categorias: ["cat-infraestrutura"],
    imagemProduto: "https://images.unsplash.com/photo-gerador",
    precoPromocional: 500.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Grua Torre 40m",
    descricao: "Grua para elevação de materiais pesados",
    descricaoBreve: "Grua de grande porte",
    categorias: ["cat-estrutural"],
    imagemProduto: "https://images.unsplash.com/photo-grua",
    precoPromocional: 1500.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },

  // 5 máquinas específicas para aplicacao
  {
    nome: "Britador Móvel",
    descricao: "Britador móvel para mineração",
    descricaoBreve: "Britador industrial",
    categorias: ["cat-mineracao"],
    imagemProduto: "https://images.unsplash.com/photo-britador",
    precoPromocional: 2000.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Guindaste 50ton",
    descricao: "Guindaste para construção civil pesada",
    descricaoBreve: "Guindaste de grande porte",
    categorias: ["cat-construcao-civil"],
    imagemProduto: "https://images.unsplash.com/photo-guindaste",
    precoPromocional: 2500.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Empilhadeira 2.5ton",
    descricao: "Empilhadeira para uso industrial",
    descricaoBreve: "Empilhadeira industrial",
    categorias: ["cat-industrial"],
    imagemProduto: "https://images.unsplash.com/photo-empilhadeira",
    precoPromocional: 400.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Trator Agrícola",
    descricao: "Trator para uso em agricultura",
    descricaoBreve: "Trator agrícola completo",
    categorias: ["cat-agricultura"],
    imagemProduto: "https://images.unsplash.com/photo-trator-agricola",
    precoPromocional: 600.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Plataforma Elevatória",
    descricao: "Plataforma para trabalho em altura",
    descricaoBreve: "Plataforma elevatória",
    categorias: ["cat-manutencao"],
    imagemProduto: "https://images.unsplash.com/photo-plataforma",
    precoPromocional: 350.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },

  // 5 máquinas com múltiplas categorias
  {
    nome: "Retroescavadeira JCB 3CX",
    descricao: "Retroescavadeira versátil para múltiplos usos",
    descricaoBreve: "Retroescavadeira multifuncional",
    categorias: ["cat-escavacao", "cat-terraplanagem", "cat-fundacao", "cat-infraestrutura", "cat-construcao-civil", "cat-mineracao"],
    imagemProduto: "https://images.unsplash.com/photo-retro",
    precoPromocional: 700.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Manipulador Telescópico",
    descricao: "Manipulador telescópico versátil",
    descricaoBreve: "Manipulador multifuncional",
    categorias: ["cat-elevacao", "cat-transporte", "cat-estrutural", "cat-acabamento", "cat-construcao-civil", "cat-industrial"],
    imagemProduto: "https://images.unsplash.com/photo-manipulador",
    precoPromocional: 800.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Mini Carregadeira",
    descricao: "Mini carregadeira para diversos usos",
    descricaoBreve: "Mini carregadeira versátil",
    categorias: ["cat-terraplanagem", "cat-limpeza", "cat-fundacao", "cat-acabamento", "cat-construcao-civil", "cat-agricultura"],
    imagemProduto: "https://images.unsplash.com/photo-minicarregadeira",
    precoPromocional: 450.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Caminhão Munck",
    descricao: "Caminhão com guindaste integrado",
    descricaoBreve: "Caminhão munck completo",
    categorias: ["cat-elevacao", "cat-transporte", "cat-estrutural", "cat-infraestrutura", "cat-construcao-civil", "cat-industrial", "cat-mineracao"],
    imagemProduto: "https://images.unsplash.com/photo-munck",
    precoPromocional: 900.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  },
  {
    nome: "Pá Carregadeira",
    descricao: "Pá carregadeira multifuncional",
    descricaoBreve: "Pá carregadeira versátil",
    categorias: ["cat-terraplanagem", "cat-carregamento", "cat-fundacao", "cat-infraestrutura", "cat-construcao-civil", "cat-mineracao", "cat-industrial"],
    imagemProduto: "https://images.unsplash.com/photo-pacarregadeira",
    precoPromocional: 850.00,
    disponivel: true,
    proprietarioId: "BU0nNFx2vuZXtPnOmPeG4ngcECk1"
  }
];

// Função para inserir categorias no Firestore
async function seedCategories() {
  console.log("Iniciando seed de categorias...");
  
  for (const [tipo, categorias] of Object.entries(CATEGORIES_DATA)) {
    for (const categoria of categorias) {
      try {
        const categoryId = `cat-${categoria.nome.toLowerCase().replace(/\s+/g, '-')}`;
        const categoriaRef = doc(collection(db, 'categorias'), categoryId);
        await setDoc(categoriaRef, {
          ...categoria,
          tipo: tipo
        });
        console.log(`Categoria ${categoria.nome} salva com sucesso!`);
      } catch (error) {
        console.error(`Erro ao salvar categoria ${categoria.nome}:`, error);
      }
    }
  }
}

// Função para inserir máquinas no Firestore
async function seedMachines() {
  console.log("Iniciando seed de máquinas...");
  for (const machine of MACHINES_DATA) {
    try {
      const machineRef = doc(collection(db, 'machines'));
      await setDoc(machineRef, {
        ...machine,
        disponivel: true,
        dataCriacao: new Date().toISOString()
      });
      console.log(`Máquina salva: ${machine.nome}`);
      console.log('Dados salvos:', {
        ...machine,
        disponivel: true,
        dataCriacao: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Erro ao salvar máquina ${machine.nome}:`, error);
    }
  }
}

// Função principal para executar todo o seed
async function seedAll() {
  console.log("Iniciando processo de seed...");
  await seedCategories();
  await seedMachines();
  console.log("Processo de seed concluído com sucesso!");
}

// Executa o seed
seedAll();
