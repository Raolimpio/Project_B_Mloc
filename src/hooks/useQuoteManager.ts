import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { quoteService } from '@/services/quote-service';
import type { Quote, QuoteRequest, QuoteStatus } from '@/types/quote';

export function useQuoteManager() {
  const { userProfile } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuotes = async () => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const userQuotes = await quoteService.getUserQuotes(userProfile.uid);
      setQuotes(userQuotes);
    } catch (err) {
      setError('Erro ao carregar orçamentos');
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [userProfile?.uid]);

  const createQuote = async (request: QuoteRequest) => {
    if (!userProfile?.uid) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      const quoteId = await quoteService.createQuote(userProfile.uid, request);
      await loadQuotes();
      return quoteId;
    } catch (err) {
      setError('Erro ao criar orçamento');
      console.error('Error creating quote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus) => {
    try {
      setLoading(true);
      setError(null);
      await quoteService.updateQuoteStatus(quoteId, status);
      await loadQuotes();
    } catch (err) {
      setError('Erro ao atualizar status do orçamento');
      console.error('Error updating quote status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuoteStatus,
    loadQuotes
  };
}
