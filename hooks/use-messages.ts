"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/lib/types'

interface SendMessageData {
  content: string
  sender_id: string
  receiver_id: string
  request_id: string
}

interface SendMessageResponse {
  id: string
  message: string
  success: boolean
}

export function useMessages({ requestId }: { requestId?: string } = {}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageData): Promise<SendMessageResponse> => {
      try {
        const response = await api.post<SendMessageResponse>('/messages', data)

        if (!response?.data) {
          throw new Error('Erro ao enviar mensagem')
        }

        return response.data
      } catch (error: any) {
        console.error('Erro ao enviar mensagem:', error)

        // Extrair mensagem de erro mais específica
        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao enviar mensagem. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas às mensagens
      queryClient.invalidateQueries({ queryKey: ['messages', requestId] })

      toast({
        title: "Mensagem enviada!",
        description: data.message || "Sua mensagem foi enviada com sucesso.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  const getMessagesByRequest = useQuery({
    queryKey: ['messages', requestId],
    queryFn: async () => {
      if (!requestId) {
        throw new Error('Request ID é obrigatório')
      }
      const response = await api.get<Message[]>(`/messages/request/${requestId}`)
      return response.data
    },
    enabled: !!requestId, // Só executa a query se requestId existir
  })

 /*  const getMessagesByUser = useQuery({
    queryKey: ['messages', 'user'],
    queryFn: async () => {
      const response = await api.get<Message[]>('/messages/user')
      return response.data
    },
  }) */

  return {
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    isSuccess: sendMessageMutation.isSuccess,
    isError: sendMessageMutation.isError,
    error: sendMessageMutation.error,
    reset: sendMessageMutation.reset,
    getMessagesByRequest,
  }
}
