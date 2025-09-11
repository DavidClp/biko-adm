"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Message } from 'react-hook-form'
import { IRequestService } from '@/lib/types'

interface ContactRequestData {
  service_type: string
  description: string
  urgency: string
  address: string
  providerId: string
  clientId: string
}

interface ContactRequestResponse {
  id: string
  message: string
  success: boolean
}

interface BudgetRequestData {
  requestId: string
  budget: number
  observation?: string
}

export function useRequestService({ clientId, providerId }: { clientId?: string, providerId?: string } = {}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const contactRequestMutation = useMutation({
    mutationFn: async (data: ContactRequestData): Promise<ContactRequestResponse> => {
      try {
        const response = await api.post<ContactRequestResponse>('/requests', data)

        if (!response?.data) {
          throw new Error('Erro ao enviar solicitação')
        }

        return response.data
      } catch (error: any) {
        console.error('Erro ao enviar solicitação de contato:', error)

        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao enviar solicitação. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })

      toast({
        title: "Solicitação enviada!",
        description: data.message || "Sua solicitação foi enviada com sucesso.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  const getRequestsByClient = useQuery({
    queryKey: ['requestsByClient', clientId],
    queryFn: async () => {
      if (!clientId) {
        return []
      }

      const response = await api.get<IRequestService[]>(`/requests/client/${clientId}`)
      return response.data
    },
  })

  const getRequestsByProvider = useQuery({
    queryKey: ['requestsByProvider', providerId],
    queryFn: async () => {
      if (!providerId) {
        return []
      }
      
      const response = await api.get<IRequestService[]>(`/requests/provider/${providerId}`)
      return response.data
    },
  })

  const sendBudgetRequestMutation = useMutation({
    mutationFn: async (data: BudgetRequestData): Promise<void> => {
      try {
        await api.post<void>('/requests/send-budget', data)
      } catch (error: any) {
        console.error('Erro ao enviar solicitação de contato:', error)

        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao enviar orçamento para a solicitação. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar orçamento para a solicitação",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  return {
    sendContactRequest: contactRequestMutation.mutate,
    isSending: contactRequestMutation.isPending,
    isSuccess: contactRequestMutation.isSuccess,
    isError: contactRequestMutation.isError,
    error: contactRequestMutation.error,
    reset: contactRequestMutation.reset,
    getRequestsByClient,
    getRequestsByProvider,
    sendBudgetRequestMutation,
  }
}
