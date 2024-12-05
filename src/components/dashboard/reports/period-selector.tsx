import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

export type PeriodType = 'day' | 'week' | 'month' | 'year';

interface PeriodSelectorProps {
  periodType: PeriodType;
  setPeriodType: (type: PeriodType) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function PeriodSelector({
  periodType,
  setPeriodType,
  selectedDate,
  onDateChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={periodType === 'day' ? 'primary' : 'outline'}
          onClick={() => setPeriodType('day')}
        >
          Diário
        </Button>
        <Button
          size="sm"
          variant={periodType === 'week' ? 'primary' : 'outline'}
          onClick={() => setPeriodType('week')}
        >
          Semanal
        </Button>
        <Button
          size="sm"
          variant={periodType === 'month' ? 'primary' : 'outline'}
          onClick={() => setPeriodType('month')}
        >
          Mensal
        </Button>
        <Button
          size="sm"
          variant={periodType === 'year' ? 'primary' : 'outline'}
          onClick={() => setPeriodType('year')}
        >
          Anual
        </Button>
      </div>

      <div className="flex gap-2">
        {periodType === 'day' && (
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="rounded-lg border px-3 py-2"
          />
        )}
        
        {periodType === 'week' && (
          <input
            type="week"
            value={`${selectedDate.getFullYear()}-W${format(selectedDate, 'ww')}`}
            onChange={(e) => {
              const [year, week] = e.target.value.split('-W');
              const date = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
              onDateChange(date);
            }}
            className="rounded-lg border px-3 py-2"
          />
        )}

        {periodType === 'month' && (
          <input
            type="month"
            value={format(selectedDate, 'yyyy-MM')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="rounded-lg border px-3 py-2"
          />
        )}

        {periodType === 'year' && (
          <select
            value={selectedDate.getFullYear()}
            onChange={(e) => onDateChange(new Date(parseInt(e.target.value), 0, 1))}
            className="rounded-lg border px-3 py-2"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}