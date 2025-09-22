"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { IRequestService, requestBudgetStatus, requestStatus } from '@/lib/types'
import { socket } from '@/lib/socket'

interface ContactRequestData {
  service_type: string
  description: string
  urgency: string
  address: string
  providerId: string
  clientId: string
}

interface EditRequestData {
  service_type?: string
  description?: string
  urgency?: string
  address?: string
  providerId?: string
  clientId?: string
  status?: requestStatus
  budget?: number
  id: string
  observation?: string
  value?: number
  budgetStatus?: requestBudgetStatus
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

interface CancelRequestData {
  requestId: string
  cancelledBy: 'client' | 'provider'
  userName?: string
  providerId?: string
  clientId?: string
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
        await api.post<void>(`/requests/send-budget/${data?.requestId}`, data)
      } catch (error: any) {
        console.error('Erro ao enviar solicitação de orçamento:', error)

        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao enviar orçamento. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar orçamento",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  const editRequestMutation = useMutation({
    mutationFn: async (data: EditRequestData): Promise<void> => {
      try {
        await api.put<void>(`/requests/${data?.id}`, data)
      } catch (error: any) {
        console.error('Erro ao editar solicitação:', error)

        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao editar solicitação. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onSuccess: (_, variables) => {
      console.log("✅ Request atualizado com sucesso:", variables)
      
      // Invalidar queries para atualizar a interface
      queryClient.invalidateQueries({ queryKey: ['requestsByClient'] })
      queryClient.invalidateQueries({ queryKey: ['requestsByProvider'] })
      
      // Forçar atualização da interface
      window.dispatchEvent(new CustomEvent('requestStatusUpdated', {
        detail: { 
          requestId: variables.id, 
          status: variables.status || "PENDING", 
          budgetStatus: variables.budgetStatus || "PENDING" 
        }
      }))
      
      if (variables.status || variables.budgetStatus) {
        console.log("📤 Emitindo evento de atualização de status via socket")
        socket.emit("chat:request_status_update", {
          requestId: variables.id,
          status: variables.status || "PENDING",
          budgetStatus: variables.budgetStatus || "PENDING"
        })
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao editar solicitação",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    },
  })

  const cancelRequestMutation = useMutation({
    mutationFn: async (data: CancelRequestData): Promise<void> => {
      try {
        const status = data.cancelledBy === 'client' ? 'CANCELLED_BY_CLIENT' : 'CANCELLED_BY_PROVIDER'
        
        await api.put<void>(`/requests/${data.requestId}`, { status })
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Erro ao cancelar solicitação. Tente novamente.'

        throw new Error(errorMessage)
      }
    },
    onSuccess: (_, variables) => {
      console.log("✅ Solicitação cancelada com sucesso:", variables)
      
      queryClient.invalidateQueries({ queryKey: ['requestsByClient'] })
      queryClient.invalidateQueries({ queryKey: ['requestsByProvider'] })
      
      const status = variables.cancelledBy === 'client' ? 'CANCELLED_BY_CLIENT' : 'CANCELLED_BY_PROVIDER'
      socket.emit("chat:request_status_update", {
        requestId: variables.requestId,
        status: status,
        budgetStatus: "CANCELLED"
      })
      
      const userName = variables.userName || (variables.cancelledBy === 'client' ? 'Cliente' : 'Prestador')
      const cancelMessage = `❌🚨 ${userName} cancelou a ${variables.cancelledBy === 'client' ? 'solicitação' : 'proposta'} 🚨❌`
      
      socket.emit("chat:send", {
        requestId: variables.requestId,
        content: cancelMessage,
        type: "TEXT",
        toUserId: variables.cancelledBy === 'client' ? variables?.providerId : variables?.clientId,
      })
      
      toast({
        title: "Solicitação cancelada",
        description: "A solicitação foi cancelada com sucesso.",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cancelar solicitação",
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
    editRequestMutation,
    cancelRequestMutation,
  }
}
