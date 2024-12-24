// Interfaces para o sistema de máquinas e categorias

// Interface para coordenadas geográficas
export interface ICoordenadas {
  lat: number;
  lng: number;
}

// Interface para localização
export interface ILocalizacao {
  cidade: string;
  estado: string;
  coordenadas: ICoordenadas;
}

// Interface para categoria no Firebase
export interface ICategoria {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  grupoPai?: string;
  bannerUrl: string;
  iconeUrl: string;
  ordem: number;
}

// Interface para categorias detalhadas de uma máquina
export interface ICategoriasDetalhadas {
  tipoTrabalho: string[];
  faseDaObra: string[];
  aplicacao: string[];
}

// Interface principal para máquinas
export interface IMaquina {
  id?: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  categorias: string[]; // Array de IDs de categorias para compatibilidade
  categoriasDetalhadas?: ICategoriasDetalhadas;
  fotos: string[]; // Array de URLs das fotos, pelo menos uma é obrigatória
  fotoPrincipal?: string; // URL da foto principal para display
  videoProduto?: string;
  precoPromocional?: number;
  disponivel?: boolean;
  proprietarioId: string;
  localizacao?: ILocalizacao;
  destaque?: boolean; // Indica se a máquina deve ser mostrada em destaque
  // Campos adicionais do formato antigo
  marca?: string;
  modelo?: string;
  ano?: number;
  horasDeUso?: number;
  potencia?: string;
  peso?: string;
  capacidade?: string;
  alcance?: string;
  consumo?: string;
  status?: string;
}

// Lista de estados brasileiros
export const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type EstadoBrasileiro = typeof ESTADOS_BRASILEIROS[number];
