import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({ 
  icon: Icon,
  title,
  value,
  description,
  trend,
  className,
  onClick
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-6 shadow-sm transition-shadow",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-primary-50 p-3">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trend.value >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
            <span className="text-gray-600">{trend.label}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}