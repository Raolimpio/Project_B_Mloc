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

export const MACHINE_CATEGORIES = [
  {
    id: 'construction',
    name: 'Construção Civil',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      'Escavadeiras',
      'Retroescavadeiras',
      'Pás-carregadeiras',
      'Mini-carregadeiras',
      'Compactadores',
      'Placas Vibratórias',
      'Rolos Compactadores',
      'Betoneiras',
      'Vibradores de Concreto',
      'Bombas de Concreto',
      'Guindastes',
      'Guinchos',
      'Plataformas Elevatórias',
      'Andaimes',
      'Escoras',
      'Formas',
      'Geradores',
      'Compressores',
      'Ferramentas Elétricas',
      'Ferramentas Manuais',
      'Equipamentos de Pintura',
      'Equipamentos de Solda',
      'Equipamentos de Corte',
      'Equipamentos de Medição',
      'Equipamentos de Segurança',
    ],
  },
];

export const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';

export const MACHINE_SUBCATEGORIES = {
  'Movimentação de Terra': [
    'Escavadeiras',
    'Retroescavadeiras',
    'Pás-carregadeiras',
    'Mini-carregadeiras',
  ],
  'Compactação': [
    'Compactadores',
    'Placas Vibratórias',
    'Rolos Compactadores',
  ],
  'Concretagem': [
    'Betoneiras',
    'Vibradores de Concreto',
    'Bombas de Concreto',
  ],
  'Elevação': [
    'Guindastes',
    'Guinchos',
    'Plataformas Elevatórias',
  ],
  'Estruturas': [
    'Andaimes',
    'Escoras',
    'Formas',
  ],
  'Energia e Ar': [
    'Geradores',
    'Compressores',
  ],
  'Ferramentas': [
    'Ferramentas Elétricas',
    'Ferramentas Manuais',
    'Equipamentos de Pintura',
    'Equipamentos de Solda',
    'Equipamentos de Corte',
  ],
  'Equipamentos de Apoio': [
    'Equipamentos de Medição',
    'Equipamentos de Segurança',
  ],
};