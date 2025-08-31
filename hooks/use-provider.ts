import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ApiResponse, Provider } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface UpdateProfileData {
  name: string
  service: string
  cityId: string
  phone: string
  description: string
}

export function useProvider({userId, providerId}: {userId?: string, providerId?: string}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Buscar dados do perfil
  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Provider> => {
      if (!userId) throw new Error('ID do provider não fornecido')
      
      try {
        const response = await api.get<ApiResponse<Provider>>(`/providers/${userId}`)

        if (!response?.data) {
          throw new Error('Provider not found')
        }

        return response?.data
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  // Atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<Provider> => {
      if (!providerId) throw new Error('ID do provider não fornecido')
      
      try {
        const response = await api.put<ApiResponse<Provider>>(`/providers/${providerId}`, data)

        if (!response?.data) {
          throw new Error('Provider not found')
        }

        return response?.data
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', providerId], data)
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    
    refetch: profileQuery.refetch,
  }
}
