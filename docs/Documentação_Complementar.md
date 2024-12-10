# Documentação Complementar - Mariloc

## 1. Sistema de Autenticação e Autorização

### 1.1 Autenticação
O sistema utiliza Firebase Authentication para gerenciamento de usuários.

#### Contexto de Autenticação
```typescript
interface AuthContextType {
  userProfile: UserProfile | null;  // Perfil do usuário atual
  loading: boolean;                 // Estado de carregamento
  error: string | null;             // Mensagens de erro
}
```

#### Fluxo de Autenticação
1. **Login/Registro**:
   - Usuários podem se registrar com email/senha
   - Login via provedor social (Google)
   - Após autenticação, perfil é criado/atualizado no Firestore

2. **Proteção de Rotas**:
```typescript
// Componente ProtectedRoute
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

3. **Permissões**:
   - `USER`: Pode visualizar e solicitar cotações
   - `OWNER`: Pode cadastrar e gerenciar máquinas
   - `ADMIN`: Acesso total ao sistema

### 1.2 Gerenciamento de Sessão
- Sessão mantida via Firebase Auth State
- Token JWT renovado automaticamente
- Logout limpa dados locais e estado do contexto

## 2. Sistema de Cotação

### 2.1 Fluxo de Cotação
1. **Solicitação Inicial**:
```typescript
interface InitialQuoteData {
  startDate: string;      // Data início
  endDate: string;        // Data fim
  purpose: string;        // Finalidade
  location: string;       // Local de uso
}
```

2. **Estados da Cotação**:
- `PENDING`: Aguardando resposta do proprietário
- `ACCEPTED`: Cotação aceita, aguardando confirmação
- `REJECTED`: Cotação recusada
- `CONFIRMED`: Aluguel confirmado
- `CANCELLED`: Cancelada por uma das partes

3. **Notificações**:
- Email automático para proprietário
- Notificações in-app
- SMS (opcional)

## 3. Componentes de UI

### 3.1 Design System

#### Cores
```css
--primary: #0066FF;
--secondary: #FF6B00;
--success: #34D399;
--error: #EF4444;
--warning: #F59E0B;
```

#### Tipografia
- Fonte principal: Inter
- Títulos: Poppins
- Escalas: 12px, 14px, 16px, 18px, 24px, 32px

### 3.2 Componentes Base

#### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

#### Input
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  error?: string;
  label?: string;
}
```

### 3.3 Componentes Compostos

#### MachineCard
```typescript
interface MachineCardProps {
  machine: IMaquina;
  variant: 'grid' | 'list';
  onQuoteClick?: () => void;
}
```

## 4. Integração com APIs Externas

### 4.1 Geolocalização
- Google Maps API para seleção de localização
- Geocoding para conversão endereço/coordenadas
- Distance Matrix para cálculo de distâncias

### 4.2 Upload de Arquivos
- Firebase Storage para imagens/documentos
- Otimização automática de imagens
- Tipos permitidos: .jpg, .png, .pdf

### 4.3 Pagamentos (Futuro)
- Integração planejada com Stripe
- Sistema de caução
- Split de pagamentos

## 5. Tratamento de Erros

### 5.1 Estratégia de Logging
```typescript
// Níveis de log
enum LogLevel {
  INFO,
  WARNING,
  ERROR,
  CRITICAL
}

// Exemplo de uso
logger.error('Falha ao processar cotação', {
  machineId,
  userId,
  error: err.message
});
```

### 5.2 Tratamento de Exceções
- Error Boundaries para erros de renderização
- Try/catch em operações assíncronas
- Fallbacks para componentes com erro

### 5.3 Feedback ao Usuário
- Toasts para notificações
- Mensagens de erro contextuais
- Estados de loading/erro em formulários

## 6. Performance e Otimização

### 6.1 Estratégias de Cache
- React Query para cache de dados
- Service Worker para assets estáticos
- Memoização de componentes pesados

### 6.2 Otimização de Imagens
```typescript
interface OptimizedImageProps {
  src: string;
  sizes: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
}
```

### 6.3 Code Splitting
- Lazy loading de rotas
- Dynamic imports para módulos grandes
- Prefetch de componentes críticos

## 7. Testes

### 7.1 Testes Unitários
```bash
# Executar testes
npm run test

# Coverage
npm run test:coverage
```

### 7.2 Testes de Integração
- Cypress para testes E2E
- MSW para mock de API
- Testes de fluxos críticos

### 7.3 Testes de Performance
- Lighthouse CI
- Web Vitals monitoring
- Bundle size analysis

## 8. Deploy e CI/CD

### 8.1 Ambiente de Desenvolvimento
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

### 8.2 Build e Deploy
```bash
# Build de produção
npm run build

# Deploy para Firebase
npm run deploy
```

### 8.3 Variáveis de Ambiente
```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
```

## 9. Estrutura do Projeto

### 9.1 Organização de Diretórios
```
src/
├── components/
│   ├── admin/      # Componentes administrativos
│   ├── auth/       # Componentes de autenticação
│   ├── debug/      # Ferramentas de debug
│   ├── forms/      # Formulários reutilizáveis
│   ├── machines/   # Componentes de máquinas
│   ├── notifications/ # Sistema de notificações
│   └── ui/         # Componentes base
├── contexts/       # Contextos React
├── hooks/          # Hooks customizados
├── lib/           # Utilitários e constantes
├── pages/         # Páginas da aplicação
└── types/         # Definições de tipos
```

### 9.2 Sistema de Notificações
```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: Date;
}
```

#### Tipos de Notificações:
- Novas cotações
- Atualizações de status
- Mensagens do sistema
- Alertas de manutenção

### 9.3 Ferramentas de Debug
- `<DebugPanel />`: Painel para visualizar estado
- `<ApiLogger />`: Log de chamadas à API
- `<PerformanceMonitor />`: Monitoramento de performance

## 10. Tipos e Interfaces Atualizados

### 10.1 Interface Completa de Máquina
```typescript
export interface IMaquina {
  // Campos básicos
  id?: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  
  // Categorização
  categorias: string[];
  categoriasDetalhadas?: {
    tipoTrabalho: string[];
    faseDaObra: string[];
    aplicacao: string[];
  };
  
  // Mídia
  imagemProduto: string;
  videoProduto?: string;
  
  // Comercial
  precoPromocional?: number;
  disponivel?: boolean;
  
  // Proprietário e Localização
  proprietarioId: string;
  localizacao?: {
    cidade: string;
    estado: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  
  // Especificações Técnicas
  marca?: string;
  modelo?: string;
  anoFabricacao?: number;
  horasDeUso?: number;
  especificacoesTecnicas?: {
    peso?: number;
    potencia?: number;
    capacidade?: number;
  };
}
```

### 10.2 Sistema de Categorias
```typescript
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
```

## 11. Boas Práticas de Desenvolvimento

### 11.1 Convenções de Código
- Nomes de componentes em PascalCase
- Nomes de hooks com prefixo 'use'
- Interfaces com prefixo 'I'

### 11.2 Performance
- Uso de React.memo para componentes pesados
- Lazy loading de rotas e componentes
- Otimização de re-renders

### 11.3 Segurança
- Validação de inputs
- Sanitização de dados
- Proteção contra XSS
