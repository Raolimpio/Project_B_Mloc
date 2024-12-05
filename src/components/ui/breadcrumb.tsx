import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Navegação estrutural"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      <ol
        className="flex items-center space-x-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          itemScope
          itemType="https://schema.org/ListItem"
          itemProp="itemListElement"
          className="flex items-center"
        >
          <Link
            to="/"
            className="flex items-center text-gray-500 transition-colors hover:text-gray-900"
            itemProp="item"
            aria-label="Página inicial"
          >
            <Home className="h-4 w-4" />
            <meta itemProp="name" content="Início" />
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => (
          <li
            key={item.label}
            itemScope
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
            className="flex items-center"
          >
            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span
                className="ml-2 font-medium text-gray-900"
                itemProp="name"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href || '#'}
                className="ml-2 text-gray-500 transition-colors hover:text-gray-900"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={`${index + 2}`} />
          </li>
        ))}
      </ol>
    </nav>
  );
}