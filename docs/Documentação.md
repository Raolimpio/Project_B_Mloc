# Documentação de Categorias e Estrutura de Dados - Mariloc

## Estrutura de Categorias

### 1. Categorias Principais (MACHINE_CATEGORIES)
As categorias principais são definidas como constantes em `lib/constants.ts`:

```typescript
[
  {
    id: 'cat-tipos-trabalho',
    nome: 'Tipos de Trabalho',
    descricaoBreve: 'Encontre máquinas por tipo de serviço',
    descricao: 'Encontre máquinas por tipo de serviço',
    iconeCategoria: '...',
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
    iconeCategoria: '...',
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
    iconeCategoria: '...',
    subcategorias: [
      'Construção Civil',
      'Mineração',
      'Industrial',
      'Residencial',
      'Comercial'
    ]
  }
]
```

### 2. Estrutura de Dados das Máquinas

#### Interface da Máquina (IMaquina)
```typescript
interface IMaquina {
  id?: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  categorias: string[];           // Array principal de IDs de categorias
  categoriasDetalhadas?: {        // Categorização detalhada opcional
    tipoTrabalho: string[];
    faseDaObra: string[];
    aplicacao: string[];
  };
  imagemProduto: string;
  videoProduto?: string;
  precoPromocional?: number;
  disponivel?: boolean;
  proprietarioId: string;
  localizacao?: ILocalizacao;
}
```

### 3. Relacionamentos e Consultas

#### No Firestore
- As máquinas são armazenadas na coleção `'machines'`
- As categorias são armazenadas na coleção `'categorias'`

#### Consultas Principais:

1. **Listagem por Categoria**:
```typescript
// Em pages/categories/[id].tsx
query(
  collection(db, 'machines'),
  where('categorias', 'array-contains', categoryId)
)
```

2. **Detalhes da Máquina**:
```typescript
// Em pages/machines/details.tsx
getDoc(doc(db, 'machines', machineId))
```

### 4. Navegação e Breadcrumbs

A navegação entre categorias e máquinas segue a estrutura:

1. **Página Principal** → **Categorias** → **Máquina**
```
/categories → /categories/:categoryId → /machines/:machineId
```

O breadcrumb usa o array `categorias` da máquina para criar links de navegação:
```typescript
{
  label: MACHINE_CATEGORIES.find(cat => machine.categorias?.includes(cat.id))?.nome,
  href: `/categories/${machine.categorias?.[0]}`
}
```

### 5. Boas Práticas

1. **Consistência de IDs**:
   - Use sempre os IDs definidos em `MACHINE_CATEGORIES` para referência
   - Exemplo: 'cat-tipos-trabalho', 'cat-fases-obra', 'cat-aplicacao'

2. **Campos de Categoria**:
   - Use `categorias` para consultas e navegação principal
   - Use `categoriasDetalhadas` para informações adicionais e filtros avançados

3. **Atualizações**:
   - Ao criar/editar uma máquina, sempre preencha o array `categorias`
   - Mantenha `categoriasDetalhadas` sincronizado com `categorias`

### 6. Exemplos de Uso

#### Criação de Máquina
```typescript
const novaMaquina = {
  nome: "Escavadeira Hidráulica",
  categorias: ["cat-tipos-trabalho"],
  categoriasDetalhadas: {
    tipoTrabalho: ["escavacao"],
    faseDaObra: ["fundacao"],
    aplicacao: ["construcao-civil"]
  }
  // ... outros campos
};
```

#### Filtro de Máquinas
```typescript
const machinesByCategory = machines.filter(machine => 
  machine.categorias.includes(categoryId)
);
```

## Fluxo de Produtos (Máquinas)

### 1. Cadastro de Produtos

#### Interface Completa do Produto
```typescript
interface IMaquina {
  id?: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  categorias: string[];
  categoriasDetalhadas?: {
    tipoTrabalho: string[];
    faseDaObra: string[];
    aplicacao: string[];
  };
  imagemProduto: string;
  videoProduto?: string;
  precoPromocional?: number;
  disponivel?: boolean;
  proprietarioId: string;
  localizacao?: {
    cidade: string;
    estado: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  marca?: string;
  modelo?: string;
  anoFabricacao?: number;
  horasDeUso?: number;
  especificacoesTecnicas?: {
    peso?: number;
    potencia?: number;
    capacidade?: number;
    // ... outras especificações
  };
}
```

#### Processo de Cadastro

1. **Upload de Imagens**:
```typescript
// Em components/upload/ImageUpload.tsx
const handleImageUpload = async (file: File) => {
  const storageRef = ref(storage, `machines/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

2. **Seleção de Categorias**:
```typescript
// Em components/forms/CategorySelect.tsx
const handleCategorySelect = (categoryId: string) => {
  // Atualiza categorias principais
  setSelectedCategories([...selectedCategories, categoryId]);
  
  // Atualiza categorias detalhadas
  const category = MACHINE_CATEGORIES.find(cat => cat.id === categoryId);
  if (category) {
    setDetailedCategories(prev => ({
      ...prev,
      [category.tipo]: [...prev[category.tipo], categoryId]
    }));
  }
};
```

3. **Salvamento no Firestore**:
```typescript
// Em pages/admin/machines/new.tsx
const saveMachine = async (machineData: IMaquina) => {
  const machineRef = collection(db, 'machines');
  await addDoc(machineRef, {
    ...machineData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};
```

### 2. Exibição de Produtos

#### Listagem de Produtos

1. **Grid de Produtos**:
```typescript
// Em components/machines/MachineGrid.tsx
const MachineGrid = () => {
  const [machines, setMachines] = useState<IMaquina[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'machines'),
      where('disponivel', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const machineList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMachines(machineList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {machines.map(machine => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};
```

2. **Filtros e Busca**:
```typescript
// Em components/machines/MachineFilters.tsx
const filters = {
  categoria: (machine: IMaquina, value: string) => 
    machine.categorias.includes(value),
  
  localizacao: (machine: IMaquina, value: string) =>
    machine.localizacao?.cidade.includes(value) || 
    machine.localizacao?.estado === value,
  
  preco: (machine: IMaquina, range: [number, number]) =>
    machine.precoPromocional >= range[0] && 
    machine.precoPromocional <= range[1]
};
```

### 3. Edição de Produtos

#### Processo de Atualização

1. **Carregamento dos Dados**:
```typescript
// Em pages/admin/machines/edit/[id].tsx
const loadMachine = async (id: string) => {
  const machineDoc = await getDoc(doc(db, 'machines', id));
  if (machineDoc.exists()) {
    return { id: machineDoc.id, ...machineDoc.data() } as IMaquina;
  }
  return null;
};
```

2. **Atualização no Firestore**:
```typescript
const updateMachine = async (id: string, data: Partial<IMaquina>) => {
  const machineRef = doc(db, 'machines', id);
  await updateDoc(machineRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
```

### 4. Detalhes do Produto

#### Página de Detalhes

1. **Carregamento de Detalhes**:
```typescript
// Em pages/machines/[id].tsx
const MachineDetails = () => {
  const [machine, setMachine] = useState<IMaquina | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const loadMachineDetails = async () => {
      const machineDoc = await getDoc(doc(db, 'machines', id));
      if (machineDoc.exists()) {
        setMachine({ id: machineDoc.id, ...machineDoc.data() } as IMaquina);
      }
    };

    loadMachineDetails();
  }, [id]);

  return (
    <div>
      <MachineGallery images={machine?.imagens} />
      <MachineInfo machine={machine} />
      <MachineSpecs machine={machine} />
      <RelatedMachines 
        categoryIds={machine?.categorias} 
        currentMachineId={machine?.id} 
      />
    </div>
  );
};
```

2. **Breadcrumb Navigation**:
```typescript
// Em components/navigation/Breadcrumb.tsx
const MachineBreadcrumb = ({ machine }: { machine: IMaquina }) => {
  const categoryId = machine.categorias[0];
  const category = MACHINE_CATEGORIES.find(cat => cat.id === categoryId);

  return (
    <Breadcrumb
      items={[
        { label: 'Categorias', href: '/categories' },
        { 
          label: category?.nome || 'Categoria',
          href: `/categories/${categoryId}`
        },
        { label: machine.nome }
      ]}
    />
  );
};
```

### 5. Exclusão de Produtos

```typescript
// Em pages/admin/machines/[id].tsx
const deleteMachine = async (id: string) => {
  // Primeiro exclui as imagens do Storage
  const imageRefs = await listAll(ref(storage, `machines/${id}`));
  await Promise.all(
    imageRefs.items.map(imageRef => deleteObject(imageRef))
  );

  // Depois exclui o documento do Firestore
  await deleteDoc(doc(db, 'machines', id));
};
```

### 6. Boas Práticas e Validações

1. **Validação de Dados**:
```typescript
const validateMachine = (data: IMaquina): boolean => {
  const required = [
    'nome',
    'descricao',
    'categorias',
    'imagemProduto',
    'proprietarioId'
  ];

  return required.every(field => !!data[field]);
};
```

2. **Otimização de Imagens**:
```typescript
const optimizeImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  return await imageCompression(file, options);
};
```

3. **Cache e Performance**:
```typescript
// Em hooks/useMachineData.ts
const useMachineData = (id: string) => {
  const queryClient = useQueryClient();
  
  return useQuery(['machine', id], async () => {
    const cached = queryClient.getQueryData(['machine', id]);
    if (cached) return cached;

    const doc = await getDoc(doc(db, 'machines', id));
    return { id: doc.id, ...doc.data() };
  }, {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000 // 30 minutos
  });
};
```

### 7. Segurança e Permissões

```typescript
// Em utils/security.ts
const checkMachinePermissions = async (
  userId: string, 
  machineId: string
): Promise<boolean> => {
  const machineDoc = await getDoc(doc(db, 'machines', machineId));
  if (!machineDoc.exists()) return false;

  const machine = machineDoc.data();
  return machine.proprietarioId === userId;
};

// Regras do Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /machines/{machineId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.proprietarioId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
