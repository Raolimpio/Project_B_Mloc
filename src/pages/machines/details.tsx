import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Share2, AlertCircle } from 'lucide-react';
import { ProductLayout } from '../../components/layout/product-layout';
import { Button } from '../../components/ui/button';
import { Breadcrumb } from '../../components/ui/breadcrumb';
import { ProductGallery } from '../../components/machines/product-gallery';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth-context';
import { MACHINE_CATEGORIES } from '../../lib/constants';
import { InitialQuoteModal } from '../../components/machines/initial-quote-modal';
import { UserInfoModal } from '../../components/machines/user-info-modal';
import { QuoteSuccessModal } from '../../components/machines/quote-success-modal';
import { createQuoteRequest } from '../../lib/quotes';
import type { IMaquina as Machine } from '../../types/machine.types';

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
      if (!id) {
        navigate('/categories');
        return;
      }

      try {
        const machineDoc = await getDoc(doc(db, 'machines', id));
        if (machineDoc.exists()) {
          const machineData = { id: machineDoc.id, ...machineDoc.data() } as Machine;
          console.log('Machine data:', machineData);
          setMachine(machineData);
        } else {
          // Se a máquina não existe, deixa machine como null
          setMachine(null);
        }
      } catch (error) {
        console.error('Erro ao carregar máquina:', error);
        // Em caso de erro, também deixa machine como null
        setMachine(null);
      } finally {
        setLoading(false);
      }
    }

    loadMachine();
  }, [id, navigate]);

  const handleInitialQuoteSubmit = async (initialQuoteData: any) => {
    setQuoteData(initialQuoteData);
    
    if (userProfile && machine) {
      try {
        console.log('Machine data for quote:', machine);
        await createQuoteRequest({
          machineId: machine.id,
          machineName: machine.nome,
          machinePhotos: machine.fotos || [],
          machineMainPhoto: machine.fotoPrincipal || (machine.fotos && machine.fotos.length > 0 ? machine.fotos[0] : null),
          ownerId: machine.proprietarioId,
          renterId: userProfile.uid,
          requesterId: userProfile.uid,
          requesterName: userProfile.displayName || 'Usuário',
          requesterEmail: userProfile.email || '',
          requesterPhone: userProfile.phoneNumber || '',
          startDate: initialQuoteData.startDate,
          endDate: initialQuoteData.endDate,
          purpose: initialQuoteData.purpose,
          location: initialQuoteData.location,
        });
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Erro ao criar orçamento:', error);
      }
    } else {
      setShowUserInfoModal(true);
    }
    setShowInitialQuoteModal(false);
  };

  const handleUserInfoSubmit = () => {
    setShowUserInfoModal(false);
    setShowSuccessModal(true);
  };

  if (loading) {
    return (
      <ProductLayout>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </main>
      </ProductLayout>
    );
  }

  if (!machine) {
    return (
      <ProductLayout>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumb
                items={[
                  {
                    label: 'Categorias',
                    href: '/categories'
                  },
                  {
                    label: 'Máquina não encontrada'
                  }
                ]}
              />
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Máquina não encontrada
              </h1>
              <p className="mb-6 text-gray-600">
                A máquina que você está procurando não está disponível ou foi removida.
              </p>
              <Button onClick={() => navigate('/categories')}>
                Voltar para Categorias
              </Button>
            </div>
          </div>
        </main>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: 'Categorias',
                  href: '/categories'
                },
                {
                  label: MACHINE_CATEGORIES.find(cat => machine.categorias?.includes(cat.id))?.nome || 'Categoria',
                  href: `/categories/${machine.categorias?.[0]}`
                },
                {
                  label: machine.nome
                }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galeria de imagens */}
            <ProductGallery
              images={[machine.imagemProduto, ...(machine.imagensAdicionais || [])]}
              title={machine.nome}
            />

            {/* Informações do produto */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{machine.nome}</h1>
              <p className="text-gray-600 mb-6">{machine.descricaoBreve}</p>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setShowInitialQuoteModal(true)}
                    size="lg"
                    className="flex-1"
                  >
                    Solicitar Orçamento
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      // Implementar compartilhamento
                    }}
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

      {showInitialQuoteModal && (
        <InitialQuoteModal
          machine={machine}
          userProfile={userProfile}
          onClose={() => setShowInitialQuoteModal(false)}
          onSubmit={handleInitialQuoteSubmit}
        />
      )}

      {showUserInfoModal && (
        <UserInfoModal
          machine={machine}
          quoteData={quoteData}
          onClose={() => setShowUserInfoModal(false)}
          onSubmit={handleUserInfoSubmit}
        />
      )}

      {showSuccessModal && (
        <QuoteSuccessModal
          onClose={() => setShowSuccessModal(false)}
          onViewQuotes={() => navigate('/dashboard')}
          machine={machine!}
          quoteData={{
            startDate: quoteData.startDate,
            endDate: quoteData.endDate,
            location: quoteData.location,
            description: quoteData.purpose,
            additionalInfo: '',
          }}
        />
      )}
    </ProductLayout>
  );
}
