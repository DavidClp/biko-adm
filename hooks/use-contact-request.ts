"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface ContactRequestData {
  serviceType: string
  description: string
  urgency: string
  address: string
  providerId: string
}

interface ContactRequestResponse {
  id: string
  message: string
  success: boolean
}

export function useContactRequest() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const contactRequestMutation = useMutation({
    mutationFn: async (data: ContactRequestData): Promise<ContactRequestResponse> => {
      try {
        const response = await api.post<ContactRequestResponse>('/request', data)

        if (!response?.data) {
          throw new Error('Erro ao enviar solicitação')
        }

        return response.data
      } catch (error: any) {
        console.error('Erro ao enviar solicitação de contato:', error)
        
        // Extrair mensagem de erro mais específica
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.error || 
                           error?.message || 
                           'Erro ao enviar solicitação. Tente novamente.'
        
        throw new Error(errorMessage)
      }
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas se necessário
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

  return {
    sendContactRequest: contactRequestMutation.mutate,
    isSending: contactRequestMutation.isPending,
    isSuccess: contactRequestMutation.isSuccess,
    isError: contactRequestMutation.isError,
    error: contactRequestMutation.error,
    reset: contactRequestMutation.reset,
  }
}
