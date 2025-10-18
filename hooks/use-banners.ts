import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BannerPosition, BannerSize } from '@/components/banner-preview';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  position: BannerPosition;
  size: BannerSize;
  isActive: boolean;
  clickCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publicVisibility: string;
  advertiser: {
    id: string;
    name: string;
    company?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Banner[];
  count?: number;
  error?: {
    title: string;
    detail?: string;
    statusCode: number;
  };
}

// Função para buscar banners por posição
async function fetchBannersByPosition(position: string, userRole?: string): Promise<Banner[]> {
  const url = userRole 
    ? `/banners/position/${position}?userRole=${userRole}`
    : `/banners/position/${position}`;
    
  const data: ApiResponse = await api.get(url);
  
  if (!data.success) {
    throw new Error(data.error?.title || 'Erro ao carregar banners');
  }
  
  return data.data || [];
}

// Função para buscar todos os banners
async function fetchAllBanners(): Promise<Banner[]> {
  const data: ApiResponse = await api.get('/banners');
  
  if (!data.success) {
    throw new Error(data.error?.title || 'Erro ao carregar banners');
  }
  
  return data.data || [];
}

// Hook para buscar banners por posição
export function useBannersByPosition(position: string, userRole?: string) {
  return useQuery({
    queryKey: ['banners', 'position', position, userRole],
    queryFn: () => fetchBannersByPosition(position, userRole),
    enabled: !!position,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook para buscar todos os banners
export function useAllBanners() {
  return useQuery({
    queryKey: ['banners', 'all'],
    queryFn: fetchAllBanners,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Função para buscar banner específico por ID
async function fetchBannerById(id: string): Promise<Banner> {
  const data: { success: boolean; data: Banner; error?: any } = await api.get(`/banners/${id}`);
  
  if (!data.success) {
    throw new Error(data.error?.title || 'Erro ao carregar banner');
  }
  
  return data.data;
}

// Hook para buscar banner específico por ID
export function useBannerById(id: string) {
  return useQuery({
    queryKey: ['banners', 'id', id],
    queryFn: () => fetchBannerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

// Hook para invalidar cache de banners
export function useBannersInvalidation() {
  const queryClient = useQueryClient();
  
  const invalidateAllBanners = () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] });
  };
  
  const invalidateBannersByPosition = (position: string) => {
    queryClient.invalidateQueries({ queryKey: ['banners', 'position', position] });
  };
  
  const invalidateBannerById = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ['banners', 'id', id] });
  };
  
  return {
    invalidateAllBanners,
    invalidateBannersByPosition,
    invalidateBannerById,
  };
}
