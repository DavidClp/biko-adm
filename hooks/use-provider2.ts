import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ApiResponse, Provider } from '@/lib/types'

export function useProvider2(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async (): Promise<Provider> => {
      try {
        const response = await api.get<ApiResponse<Provider>>(`/providers/${id}`)
        
        if (!response?.data) {
          throw new Error('Provider not found')
        }
        return response?.data
      } catch (error) {
        console.error('Erro ao buscar provider:', error)
        throw error
      }
    },
    enabled: !!id, // Só executa se o ID existir
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })
}
