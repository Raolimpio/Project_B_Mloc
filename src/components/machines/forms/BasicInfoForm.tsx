import { MACHINE_CATEGORIES, WORK_PHASES } from '@/lib/constants';

interface BasicInfoFormProps {
  formData: {
    name: string;
    category: string;
    subcategory: string;
    workPhase: string;
    shortDescription: string;
    longDescription: string;
  };
  onChange: (data: Partial<BasicInfoFormProps['formData']>) => void;
}

export function BasicInfoForm({ formData, onChange }: BasicInfoFormProps) {
  const selectedCategory = MACHINE_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome da Máquina</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Digite o nome da máquina"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Categoria</label>
          <select
            required
            value={formData.category}
            onChange={(e) => onChange({ 
              category: e.target.value,
              subcategory: '' // Reset subcategory when category changes
            })}
            className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {MACHINE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Subcategoria</label>
          <select
            required
            value={formData.subcategory}
            onChange={(e) => onChange({ subcategory: e.target.value })}
            className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            disabled={!formData.category}
          >
            <option value="">Selecione uma subcategoria</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fase da Obra</label>
          <select
            required
            value={formData.workPhase}
            onChange={(e) => onChange({ workPhase: e.target.value })}
            className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          >
            <option value="">Selecione a fase</option>
            {Object.keys(WORK_PHASES).map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descrição Curta</label>
        <input
          type="text"
          required
          value={formData.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Breve descrição da máquina"
          maxLength={100}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descrição Detalhada</label>
        <textarea
          required
          value={formData.longDescription}
          onChange={(e) => onChange({ longDescription: e.target.value })}
          className="h-32 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Descrição detalhada da máquina"
        />
      </div>
    </div>
  );
}