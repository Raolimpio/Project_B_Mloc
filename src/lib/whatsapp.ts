import type { IMaquina as Machine } from '../types/machine.types';

interface QuoteData {
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  additionalInfo: string;
}

export function formatWhatsAppMessage(machine: Machine, quoteData: QuoteData): string {
  const message = `
*Orçamento - Mariloc*
------------------
*Máquina:* ${machine.nome}
*Período:* ${formatDate(quoteData.startDate)} até ${formatDate(quoteData.endDate)}
*Local de Entrega:* ${quoteData.location}
*Descrição:* ${quoteData.description}
${quoteData.additionalInfo ? `*Informações Adicionais:* ${quoteData.additionalInfo}` : ''}
------------------
  `.trim();

  return encodeURIComponent(message);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function generateWhatsAppLink(phone: string, message: string): string {
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona o código do país se não existir
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  return `https://wa.me/${fullPhone}?text=${message}`;
}
