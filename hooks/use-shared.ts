import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ApiResponse, City } from '@/lib/types'

export function useShared() {
  const citiesQuery = useQuery({
    queryKey: ['cities'],
    queryFn: async (): Promise<City[]> => {
      try {
        const {data} = await api.get<City[]>('/cities')
        return data || []
      } catch (error) {
        console.error('Erro ao buscar cidades:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  return {
    cities: citiesQuery.data || [],
    isLoadingCities: citiesQuery.isLoading,
    errorCities: citiesQuery.error,
    refetchCities: citiesQuery.refetch,
  }
}