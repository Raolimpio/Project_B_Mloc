import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de newsletter
    console.log('Newsletter signup:', email);
  };

  return (
    <section className="bg-primary-600 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Fique por dentro das nossas novidades
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Assine nossa newsletter e receba as melhores ofertas e novidades
          </p>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
            <Button
              type="submit"
              className="bg-secondary-500 text-white hover:bg-secondary-600"
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}