import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Advertiser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  banners: Banner[];
}

export interface Banner {
  id: string;
  advertiserId: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  size: string;
  isActive: boolean;
  clickCount: number;
  viewCount: number;
  publicVisibility: string;
}

interface ApiResponse {
  success: boolean;
  data?: Advertiser[] | Advertiser;
  count?: number;
  error?: {
    title: string;
    detail?: string;
    statusCode: number;
  };
}

// Função para buscar todos os anunciantes
async function fetchAdvertisers(): Promise<Advertiser[]> {
  const data: ApiResponse = await api.get('/advertisers');
  
  if (!data.success) {
    throw new Error(data.error?.title || 'Erro ao carregar anunciantes');
  }
  
  return Array.isArray(data.data) ? data.data : [];
}

// Função para criar anunciante
async function createAdvertiser(advertiserData: Partial<Advertiser>): Promise<Advertiser> {
  const result: ApiResponse = await api.post('/advertisers', advertiserData);

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao criar anunciante');
  }

  return result.data as Advertiser;
}

// Função para atualizar anunciante
async function updateAdvertiser(id: string, advertiserData: Partial<Advertiser>): Promise<Advertiser> {
  const result: ApiResponse = await api.put(`/advertisers/${id}`, advertiserData);

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao atualizar anunciante');
  }

  return result.data as Advertiser;
}

// Função para deletar anunciante
async function deleteAdvertiser(id: string): Promise<void> {
  const result: ApiResponse = await api.delete(`/advertisers/${id}`);

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao deletar anunciante');
  }
}

// Hook para buscar todos os anunciantes
export function useAdvertisers() {
  return useQuery({
    queryKey: ['advertisers'],
    queryFn: fetchAdvertisers,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook para criar anunciante
export function useCreateAdvertiser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdvertiser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
    },
    onError: (error) => {
      console.error('Erro ao criar anunciante:', error);
    },
  });
}

// Hook para atualizar anunciante
export function useUpdateAdvertiser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Advertiser> }) => 
      updateAdvertiser(id, data),
    onSuccess: (updatedAdvertiser, variables) => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      queryClient.invalidateQueries({ 
        queryKey: ['advertisers', variables.id] 
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar anunciante:', error);
    },
  });
}

// Hook para deletar anunciante
export function useDeleteAdvertiser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdvertiser,
    onSuccess: (_, advertiserId) => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      queryClient.removeQueries({ 
        queryKey: ['advertisers', advertiserId] 
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar anunciante:', error);
    },
  });
}
