import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Share2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { MACHINE_CATEGORIES, DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import { InitialQuoteModal } from '@/components/machines/initial-quote-modal';
import { UserInfoModal } from '@/components/machines/user-info-modal';
import { QuoteSuccessModal } from '@/components/machines/quote-success-modal';
import type { Machine } from '@/types';

export default function MachineDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInitialQuoteModal, setShowInitialQuoteModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);

  useEffect(() => {
    async function loadMachine() {
      if (!id) return;

      try {
        const docRef = doc(db, 'machines', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMachine({ id: docSnap.id, ...docSnap.data() } as Machine);
        } else {
          navigate('/categories');
        }
      } catch (error) {
        console.error('Erro ao carregar máquina:', error);
        navigate('/categories');
      } finally {
        setLoading(false);
      }
    }

    loadMachine();
  }, [id, navigate]);

  if (loading || !machine) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const category = MACHINE_CATEGORIES.find((cat) => cat.id === machine.category);
  const breadcrumbItems = [
    { label: 'Categorias', href: '/categories' },
    { label: category?.name || 'Categoria', href: `/categories/${machine.category}` },
    { label: machine.name },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: machine.name,
          text: machine.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleRequestQuote = () => {
    if (!userProfile) {
      setShowUserInfoModal(true);
    } else {
      setShowInitialQuoteModal(true);
    }
  };

  const handleQuoteNext = (data: any) => {
    setQuoteData(data);
    if (!userProfile) {
      setShowInitialQuoteModal(false);
      setShowUserInfoModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Product Image */}
              <div className="mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={machine.imageUrl || machine.photoUrl || DEFAULT_CATEGORY_IMAGE}
                    alt={machine.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_CATEGORY_IMAGE;
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                <h1 className="mb-2 text-3xl font-bold">{machine.name}</h1>
                <p className="mb-4 text-lg text-gray-600">{machine.shortDescription}</p>
                <div className="prose max-w-none">
                  <p className="text-gray-600">{machine.longDescription}</p>
                </div>
              </div>

              {/* Video Section */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Vídeo do Produto</h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/m_vedl0aUps?si=lF-zZCUXe5kHdYrb&controls=0"
                    title={`Vídeo de ${machine.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">Faça sua Reserva</h2>
                
                <div className="grid gap-4">
                  <Button
                    onClick={handleRequestQuote}
                    className="flex items-center justify-center gap-2"
                  >
                    Solicitar Orçamento
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                    Compartilhar
                  </Button>
                </div>

                <div className="mt-6 rounded-lg bg-primary-50 p-4">
                  <h3 className="mb-2 font-medium text-primary-900">Instruções</h3>
                  <p className="text-sm text-primary-700">
                    Para a utilização segura deste equipamento, utilize EPI (Equipamento de Proteção Individual)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showInitialQuoteModal && (
        <InitialQuoteModal
          machine={machine}
          userProfile={userProfile}
          onClose={() => setShowInitialQuoteModal(false)}
          onNext={handleQuoteNext}
        />
      )}

      {showUserInfoModal && (
        <UserInfoModal
          machine={machine}
          quoteData={quoteData}
          onClose={() => setShowUserInfoModal(false)}
          onSuccess={() => {
            setShowUserInfoModal(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      {showSuccessModal && (
        <QuoteSuccessModal
          onClose={() => setShowSuccessModal(false)}
          onViewQuotes={() => navigate('/dashboard')}
        />
      )}
    </>
  );
}