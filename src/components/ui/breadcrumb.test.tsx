import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Categorias', href: '/categories' },
    { label: 'Construção Civil', href: '/categories/construction' },
    { label: 'Betoneira 200L' },
  ];

  it('renders all breadcrumb items', () => {
    render(
      <BrowserRouter>
        <Breadcrumb items={items} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Navegação estrutural')).toBeInTheDocument();
    expect(screen.getByLabelText('Página inicial')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Construção Civil')).toBeInTheDocument();
    expect(screen.getByText('Betoneira 200L')).toBeInTheDocument();
  });

  it('marks the last item as current page', () => {
    render(
      <BrowserRouter>
        <Breadcrumb items={items} />
      </BrowserRouter>
    );

    const lastItem = screen.getByText('Betoneira 200L');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });
});