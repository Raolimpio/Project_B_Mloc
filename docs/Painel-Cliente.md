# Documentação do Painel do Cliente

## Visão Geral
O painel do cliente é uma interface centralizada que permite aos usuários gerenciar suas atividades relacionadas ao aluguel de máquinas. O painel foi projetado para ser intuitivo e eficiente, focando nas principais funcionalidades necessárias para os clientes.

## Componentes Principais

### 1. Cabeçalho do Painel
- Saudação personalizada com o nome do usuário
- Botões de navegação rápida:
  - "Painel Inicial" (ícone Home)
  - "Editar Perfil" (ícone UserCircle)

### 2. Cards de Estatísticas
O painel apresenta três cards principais que mostram:
- **Máquinas Disponíveis**: Total de máquinas no sistema
- **Orçamentos Ativos**: Número de orçamentos pendentes ou em cotação
- **Aluguéis Ativos**: Número de aluguéis em andamento (aceitos, em preparação, em trânsito ou entregues)

### 3. Lista de Máquinas

#### Sistema de Filtragem
A lista de máquinas possui um sistema de filtragem duplo:

1. **Barra de Pesquisa**
   - Permite busca por texto em:
     - Nome da máquina
     - Descrição breve
   - Pesquisa em tempo real
   - Suporte a múltiplas palavras-chave

2. **Filtro por Categorias**
   - Três categorias principais:
     - Aplicações
     - Fases da Obra
     - Tipos de Trabalho
   - Botão "Todas" para remover filtros
   - Filtros visualmente destacados quando ativos

#### Exibição de Máquinas
- Layout em grid responsivo (3 colunas em desktop)
- Cards de máquina contendo:
  - Imagem do produto
  - Nome da máquina
  - Descrição breve
  - Categorias detalhadas
  - Botões de ação contextuais:
    - "Editar" (para proprietários)
    - "Alugar" (para clientes)

## Funcionalidades

### Carregamento de Dados
- Carregamento automático de todas as máquinas ao iniciar
- Carregamento dos orçamentos do usuário
- Sistema de loading state durante carregamentos

### Navegação
- Troca dinâmica entre views (overview, machines, quotes, rentals, profile)
- Navegação direta para edição de perfil

### Filtragem
- Filtragem combinada (AND) entre pesquisa e categoria
- Pesquisa case-insensitive
- Suporte a múltiplas palavras na pesquisa

## Estados do Sistema

### Loading State
- Spinner animado durante carregamento
- Mensagem informativa "Carregando máquinas..."

### Estado Vazio
- Mensagem apropriada quando nenhuma máquina é encontrada

## Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Grid de máquinas responsivo:
  - 3 colunas em desktop (lg)
  - 2 colunas em tablet (sm)
  - 1 coluna em mobile

## Segurança
- Verificação de permissões para ações específicas
- Controle de acesso baseado no perfil do usuário
