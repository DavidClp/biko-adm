import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ProviderMetrics {
  total_search_appearances: number;
  total_profile_views: number;
  search_appearances_today: number;
  profile_views_today: number;
  search_appearances_this_week: number;
  profile_views_this_week: number;
  search_appearances_this_month: number;
  profile_views_this_month: number;
  daily_metrics: {
    date: string;
    search_appearances: number;
    profile_views: number;
  }[];
}

interface UseProviderMetricsProps {
  providerId: string;
  enabled?: boolean;
  query?: string;
  cityId?: string;
}

export function useProviderMetrics({ providerId, enabled = true, query, cityId }: UseProviderMetricsProps) {
  return useQuery<ProviderMetrics>({
    queryKey: ['provider-metrics', providerId, query, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (cityId) params.append('cityId', cityId);
      
      const url = `/providers/metrics/${providerId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    },
    enabled: enabled && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}
