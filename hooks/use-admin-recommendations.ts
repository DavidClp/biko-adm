import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Recommendation {
  id: string;
  giverId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  giver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
    cpf: string | null;
    pix_key: string | null;
  };
  receiver: {
    id: string;
    email: string;
    role: string;
    recommendation_code: string | null;
    provider?: {
      id: string;
      name: string;
      business_name: string | null;
      status: string;
      city?: {
        name: string;
        state: {
          initials: string;
        };
      };
    };
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface RecommendationsResponse {
  success: boolean;
  data: Recommendation[];
  pagination: Pagination;
}

interface UseAdminRecommendationsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export function useAdminRecommendations(params: UseAdminRecommendationsParams = {}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get<RecommendationsResponse>(
        `/recommendations/admin/all?${queryParams.toString()}`
      );

      //@ts-ignore
      if (response.success) {
        //@ts-ignore
        setRecommendations(response.data);
        //@ts-ignore
        setPagination(response.pagination);
      } else {
        setError('Erro ao carregar recomendações');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.detail || 'Erro ao carregar recomendações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [params.page, params.limit, params.startDate, params.endDate]);

  return {
    recommendations,
    pagination,
    isLoading,
    error,
    refetch: fetchRecommendations,
  };
}
