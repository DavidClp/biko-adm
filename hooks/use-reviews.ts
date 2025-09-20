"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface CreateReviewData {
  provider_id: string
  review: string
  stars: number
}

interface CreateReviewResponse {
  id: string
  message: string
  success: boolean
}

interface ProviderReview {
  id: string
  provider_id: string
  review: string
  stars: number
  status: string
  createdAt: string
  updatedAt: string
}

interface ReviewsResponse {
  success: boolean
  data: ProviderReview[]
  count: number
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function useReviews({ 
  providerId, 
  page = 1, 
  limit = 10 
}: { 
  providerId?: string
  page?: number
  limit?: number
} = {}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createReviewMutation = useMutation({
    mutationFn: async (data: CreateReviewData): Promise<CreateReviewResponse> => {
      try {
        const response = await api.post<CreateReviewResponse>('/provider-reviews', data)

        if (!response?.data) {
          throw new Error('Erro ao criar avaliação')
        }

        return response.data
      } catch (error: any) {
        console.error('Erro ao criar avaliação:', error)

        // Extrair mensagem de erro mais específica
        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao criar avaliação. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas às avaliações
      queryClient.invalidateQueries({ queryKey: ['provider-reviews', providerId] })
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })

      toast({
        title: "Avaliação enviada!",
        description: data.message || "Sua avaliação foi enviada com sucesso.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  const getReviewsByProvider = useQuery({
    queryKey: ['provider-reviews', providerId, page, limit],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID é obrigatório')
      }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await api.get<ReviewsResponse>(`/provider-reviews/provider/${providerId}?${params}`)
      return response.data
    },
    enabled: !!providerId,  
  })

  return {
    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isSuccess: createReviewMutation.isSuccess,
    isError: createReviewMutation.isError,
    error: createReviewMutation.error,
    reset: createReviewMutation.reset,
    getReviewsByProvider,
  }
}
