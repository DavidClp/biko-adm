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

export function useProvider({ providerId }: { providerId?: string }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile', providerId],
    queryFn: async (): Promise<Provider> => {
      try {
        const { data } = await api.get<Provider>(`/providers/${providerId}`)

        console.log("data", data)
        if (!data) {
          throw new Error('Provider not found')
        }

        return data
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error
      }
    },
    enabled: !!providerId,
 //   staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (params: UpdateProfileData): Promise<Provider> => {
      try {
        const { data } = await api.put<Provider>(`/providers/${providerId}`, params)

        if (!data) {
          throw new Error('Provider not found')
        }

        return data
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

  const updateListedStatusMutation = useMutation({
    mutationFn: async (isListed: boolean): Promise<Provider> => {
      try {
        const { data } = await api.put<Provider>(`/providers/${providerId}`, { is_listed: isListed })

        if (!data) {
          throw new Error('Provider not found')
        }

        return data
      } catch (error) {
        console.error('Erro ao atualizar status de listagem:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', providerId], data)
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })

      toast({
        title: "Status atualizado!",
        description: data.is_listed ? "Seu perfil agora aparece nas buscas." : "Seu perfil foi removido das buscas.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  return {
    provider: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,

    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,

    updateListedStatus: updateListedStatusMutation.mutate,
    isUpdatingListedStatus: updateListedStatusMutation.isPending,

    refetch: profileQuery.refetch,
  }
}
