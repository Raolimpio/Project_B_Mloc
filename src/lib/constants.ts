// Fases da Obra (mantido para compatibilidade)
export const WORK_PHASES = {
  'Canteiro de obras': {
    machines: [
      'Geradores',
      'Compressores',
      'Ferramentas Elétricas',
      'Ferramentas Manuais',
      'Equipamentos de Segurança'
    ]
  },
  'Cobertura': {
    machines: [
      'Andaimes',
      'Escadas',
      'Guinchos',
      'Plataformas Elevatórias'
    ]
  },
  'Fundação': {
    machines: [
      'Escavadeiras',
      'Retroescavadeiras',
      'Compactadores',
      'Placas Vibratórias'
    ]
  },
  'Estrutura e alvenaria': {
    machines: [
      'Betoneiras',
      'Vibradores de Concreto',
      'Bombas de Concreto',
      'Andaimes',
      'Escoras',
      'Formas'
    ]
  },
  'Inst. elétricas e hidrossanitárias': {
    machines: [
      'Furadeiras',
      'Marteletes',
      'Ferramentas Elétricas',
      'Equipamentos de Medição'
    ]
  },
  'Esquadrias': {
    machines: [
      'Serras',
      'Furadeiras',
      'Parafusadeiras',
      'Ferramentas Manuais'
    ]
  },
  'Revestimento': {
    machines: [
      'Lixadeiras',
      'Misturadores',
      'Desempenadeiras',
      'Réguas Vibratórias'
    ]
  },
  'Acabamento': {
    machines: [
      'Lixadeiras',
      'Pinturas',
      'Compressores',
      'Ferramentas Manuais'
    ]
  },
  'Jardinagem': {
    machines: [
      'Cortadores de Grama',
      'Roçadeiras',
      'Motosserras',
      'Ferramentas de Jardim'
    ]
  },
  'Limpeza': {
    machines: [
      'Lavadoras de Alta Pressão',
      'Aspiradores',
      'Varredeiras',
      'Equipamentos de Limpeza'
    ]
  }
};

// Novas categorias principais
export const MACHINE_CATEGORIES = [
  {
    id: 'cat-tipos-trabalho',
    nome: 'Tipos de Trabalho',
    descricaoBreve: 'Encontre máquinas por tipo de serviço',
    descricao: 'Encontre máquinas por tipo de serviço',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
    subcategorias: [
      'Escavação',
      'Terraplanagem',
      'Demolição',
      'Compactação',
      'Transporte'
    ]
  },
  {
    id: 'cat-fases-obra',
    nome: 'Fases da Obra',
    descricaoBreve: 'Equipamentos para cada etapa',
    descricao: 'Equipamentos para cada etapa da sua obra',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37',
    subcategorias: [
      'Fundação',
      'Infraestrutura',
      'Estrutura',
      'Acabamento',
      'Manutenção'
    ]
  },
  {
    id: 'cat-aplicacao',
    nome: 'Aplicação',
    descricaoBreve: 'Soluções para cada segmento',
    descricao: 'Soluções específicas para cada segmento',
    iconeCategoria: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
    subcategorias: [
      'Construção Civil',
      'Mineração',
      'Industrial',
      'Residencial',
      'Comercial'
    ]
  }
];

// Constantes para os tipos de trabalho
export const WORK_TYPES = {
  escavacao: {
    name: 'Escavação',
    description: 'Equipamentos para escavação e movimentação de terra',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  },
  terraplanagem: {
    name: 'Terraplanagem',
    description: 'Máquinas para nivelamento e preparação de terrenos',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  },
  demolicao: {
    name: 'Demolição',
    description: 'Equipamentos para demolição controlada',
    image: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7',
    iconeCategoria: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
  },
  compactacao: {
    name: 'Compactação',
    description: 'Máquinas para compactação de solo',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  },
  transporte: {
    name: 'Transporte',
    description: 'Veículos para transporte de materiais',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  }
};

// Constantes para as fases da obra
export const CONSTRUCTION_PHASES = {
  fundacao: {
    name: 'Fundação',
    description: 'Equipamentos para a fase de fundação',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  },
  infraestrutura: {
    name: 'Infraestrutura',
    description: 'Máquinas para infraestrutura básica',
    image: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7',
    iconeCategoria: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
  },
  estrutura: {
    name: 'Estrutura',
    description: 'Equipamentos para fase estrutural',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  },
  acabamento: {
    name: 'Acabamento',
    description: 'Máquinas para acabamento',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  },
  manutencao: {
    name: 'Manutenção',
    description: 'Equipamentos para manutenção',
    image: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7',
    iconeCategoria: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
  }
};

// Subcategorias de máquinas (mantido para compatibilidade)
export const MACHINE_SUBCATEGORIES = {
  'Escavação': [
    'Escavadeiras',
    'Retroescavadeiras',
    'Mini-escavadeiras',
    'Valetadeiras'
  ],
  'Terraplanagem': [
    'Motoniveladoras',
    'Pás-carregadeiras',
    'Tratores',
    'Scrapers'
  ],
  'Demolição': [
    'Martelos Hidráulicos',
    'Rompedores',
    'Tesouras Demolidoras',
    'Britadores'
  ],
  'Compactação': [
    'Rolos Compactadores',
    'Placas Vibratórias',
    'Compactadores de Solo',
    'Sapos Mecânicos'
  ],
  'Transporte': [
    'Caminhões Basculantes',
    'Caminhões Betoneira',
    'Dumpers',
    'Transportadores'
  ],
  'Fundação': [
    'Bate-estacas',
    'Perfuratrizes',
    'Sondas Rotativas',
    'Injetoras de Concreto'
  ],
  'Estrutura': [
    'Gruas',
    'Guindastes',
    'Manipuladores Telescópicos',
    'Plataformas Elevatórias'
  ],
  'Acabamento': [
    'Lixadeiras',
    'Politrizes',
    'Fratasadeiras',
    'Alisadoras de Concreto'
  ]
};

// Imagem padrão para categorias
export const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';

// Constantes para os tipos de aplicação
export const APPLICATION_TYPES = {
  construcaoCivil: {
    name: 'Construção Civil',
    description: 'Equipamentos para construção civil',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  },
  mineracao: {
    name: 'Mineração',
    description: 'Máquinas para mineração',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  },
  industrial: {
    name: 'Industrial',
    description: 'Equipamentos para uso industrial',
    image: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7',
    iconeCategoria: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
  },
  residencial: {
    name: 'Residencial',
    description: 'Máquinas para uso residencial',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
    iconeCategoria: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  },
  comercial: {
    name: 'Comercial',
    description: 'Equipamentos para construções comerciais',
    image: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
    iconeCategoria: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37'
  }
};
