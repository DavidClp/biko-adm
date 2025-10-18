import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner } from './use-banners';
import { api } from '@/lib/api';

interface CreateBannerData {
  advertiserId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  position: string;
  size: string;
  isActive?: boolean;
  imageFile?: File;
  publicVisibility?: string;
}

interface UpdateBannerData {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
  position?: string;
  size?: string;
  isActive?: boolean;
  publicVisibility?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Banner;
  message?: string;
  error?: {
    title: string;
    detail?: string;
    statusCode: number;
  };
}

// Função para criar banner
async function createBanner(data: CreateBannerData): Promise<Banner> {
  const formData = new FormData();
  formData.append('advertiserId', data.advertiserId);
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  formData.append('position', data.position);
  formData.append('size', data.size);
  formData.append('isActive', (data.isActive ?? true).toString());
  formData.append('publicVisibility', data.publicVisibility || 'ALL');
  
  if (data.imageFile) {
    formData.append('image', data.imageFile);
  } else if (data.imageUrl) {
    formData.append('imageUrl', data.imageUrl);
  }

  const result: ApiResponse = await api.post('/banners', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao criar banner');
  }

  return result.data!;
}

// Função para atualizar banner
async function updateBanner(id: string, data: UpdateBannerData): Promise<Banner> {
  let result: ApiResponse;
  
  if (data.imageFile) {
    // Se há arquivo de imagem, usar FormData
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.position) formData.append('position', data.position);
    if (data.size) formData.append('size', data.size);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.publicVisibility) formData.append('publicVisibility', data.publicVisibility);
    formData.append('image', data.imageFile);
    
    result = await api.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } else {
    // Se não há arquivo, usar JSON normal
    const jsonData = { ...data };
    delete jsonData.imageFile;
    result = await api.put(`/banners/${id}`, jsonData);
  }

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao atualizar banner');
  }

  return result.data!;
}

// Função para deletar banner
async function deleteBanner(id: string): Promise<void> {
  const result: ApiResponse = await api.delete(`/banners/${id}`);

  if (!result.success) {
    throw new Error(result.error?.title || 'Erro ao deletar banner');
  }
}

// Função para incrementar clique
async function incrementBannerClick(id: string): Promise<void> {
  await api.post(`/banners/${id}/click`);
}

// Função para incrementar visualização
async function incrementBannerView(id: string): Promise<void> {
  await api.post(`/banners/${id}/view`);
}

// Hook para criar banner
export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBanner,
    onSuccess: (newBanner) => {
      // Invalidar cache de todos os banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      
      // Invalidar cache específico da posição do banner criado
      queryClient.invalidateQueries({ 
        queryKey: ['banners', 'position', newBanner.position] 
      });
    },
    onError: (error) => {
      console.error('Erro ao criar banner:', error);
    },
  });
}

// Hook para atualizar banner
export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerData }) => 
      updateBanner(id, data),
    onSuccess: (updatedBanner, variables) => {
      // Invalidar cache de todos os banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      
      // Invalidar cache específico do banner
      queryClient.invalidateQueries({ 
        queryKey: ['banners', 'id', variables.id] 
      });
      
      // Invalidar cache da posição do banner
      queryClient.invalidateQueries({ 
        queryKey: ['banners', 'position', updatedBanner.position] 
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar banner:', error);
    },
  });
}

// Hook para deletar banner
export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: (_, bannerId) => {
      // Invalidar cache de todos os banners
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      
      // Remover banner específico do cache
      queryClient.removeQueries({ 
        queryKey: ['banners', 'id', bannerId] 
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar banner:', error);
    },
  });
}

// Hook para incrementar clique
export function useIncrementBannerClick() {
  return useMutation({
    mutationFn: incrementBannerClick,
    onError: (error) => {
      console.error('Erro ao registrar clique:', error);
    },
  });
}

// Hook para incrementar visualização
export function useIncrementBannerView() {
  return useMutation({
    mutationFn: incrementBannerView,
    onError: (error) => {
      console.error('Erro ao registrar visualização:', error);
    },
  });
}
