import { api } from './api';

export interface ProviderPhoto {
  id: string;
  provider_id: string;
  photo_url: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderPhotoData {
  description?: string;
  order?: number;
}

export interface UpdateProviderPhotoData {
  description?: string;
  order?: number;
}

export interface ListProviderPhotosResponse {
  data: ProviderPhoto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const providerPhotosApi = {
  // Listar fotos do profissional
  list: async (providerId: string, page = 1, limit = 10): Promise<ListProviderPhotosResponse> => {
    const response = await api.get(`/provider-photos/${providerId}`, {
      params: { page, limit }
    });
    return response;
  },

  // Obter foto específica
  getById: async (photoId: string): Promise<ProviderPhoto> => {
    const response = await api.get(`/provider-photos/photo/${photoId}`);
    return response.data;
  },

  // Upload de nova foto
  upload: async (providerId: string, file: File, data?: CreateProviderPhotoData): Promise<ProviderPhoto> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    if (data?.description) {
      formData.append('description', data.description);
    }
    
    if (data?.order !== undefined) {
      formData.append('order', data.order.toString());
    }

    const response = await api.post(`/provider-photos/${providerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Atualizar foto
  update: async (photoId: string, data: UpdateProviderPhotoData): Promise<ProviderPhoto> => {
    const response = await api.put(`/provider-photos/${photoId}`, data);
    return response.data;
  },

  // Deletar foto
  delete: async (photoId: string): Promise<void> => {
    await api.delete(`/provider-photos/${photoId}`);
  },
};
