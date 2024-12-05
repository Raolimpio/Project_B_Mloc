import { useEffect, useState } from 'react';

const BRANDS = [
  { name: 'Makita', logo: 'https://mariloc.com.br/storage/2024/07/makita.png' },
  { name: 'Bosch', logo: 'https://mariloc.com.br/storage/2024/07/bosch.png' },
  { name: 'CSM', logo: 'https://mariloc.com.br/storage/2024/07/csm.png' },
  { name: 'Karcher', logo: 'https://mariloc.com.br/storage/2024/07/karcher.png' },
  { name: 'Vibromak', logo: 'https://mariloc.com.br/storage/2024/07/vibromak.png' },
];

export function BrandSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRANDS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm font-medium text-gray-600">
          As melhores marcas mundiais você aluga na Mariloc, os profissionais mais qualificados!
        </p>
        
        <div className="flex items-center justify-center gap-8">
          {BRANDS.map((brand, index) => (
            <div
              key={brand.name}
              className={`transition-opacity duration-300 ${
                index === currentIndex ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/200x80/gray/white?text=${brand.name}`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}