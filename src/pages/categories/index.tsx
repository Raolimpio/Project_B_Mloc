import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryGrid } from '@/components/categories/category-grid';

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <CategoryGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}