import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./use-auth"
import { subscriptionsAttributes, transactionsAttributes } from "@/app/dashboard/components/interfaces";

export interface IPlan {
  value: string;
  id: string;
  gateway_id?: number | null;
  name?: string;
  icon?: string;
  active?: boolean;
  is_test_free?: boolean;
  recurrence: number | null;
  frequency: number;
  permissions?: string[] | null;
  description?: string;
}

interface Subscription {
  id: string
  plan_id: string
  status: string
  payment_method: string
  created_at: string
  expires_at: string
  plan: IPlan
}

// Função para buscar planos
const fetchPlans = async (): Promise<IPlan[]> => {
  const response = await api.get("/plans")
  return response.data || []
}

// Função para buscar assinaturas
const fetchSubscription = async (providerId?: string): Promise<{
  subscription: subscriptionsAttributes | null
  transactions: transactionsAttributes[]
}> => {
  if (!providerId) {
    return { subscription: null, transactions: [] }
  }

  const response = await api.get("/subscriptions", {
    params: {
      provider_id: providerId
    }
  })

  return {
    subscription: (response as any)?.subscription as subscriptionsAttributes || null,
    transactions: (response as any)?.transactions as transactionsAttributes[] || []
  }
}

export function useSubscriptions() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query para buscar planos
  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    error: plansError
  } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Query para buscar assinaturas
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: subscriptionError
  } = useQuery({
    queryKey: ["subscriptions", user?.provider?.id],
    queryFn: () => fetchSubscription(user?.provider?.id),
    enabled: !!user?.provider?.id,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true
  })

  // Estados derivados
  const subscription = subscriptionData?.subscription || null
  const transactionsSubscriptions = subscriptionData?.transactions || []
  const loading = isLoadingPlans || isLoadingSubscription

  // Mutation para assinar plano
  const subscribeToPlanMutation = useMutation({
    mutationFn: async ({ planId, paymentMethod, cardData }: {
      planId: string
      paymentMethod: string
      cardData?: any
    }) => {
      const subscriptionData = {
        plan_id: planId,
        payment_method: paymentMethod,
        ...(paymentMethod === "credit_card" && { card_data: cardData })
      }

      return await api.post("/subscriptions", subscriptionData)
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Assinatura realizada com sucesso",
        variant: "default",
      })

      // Invalidar cache das assinaturas para refetch automático
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
    },
    onError: (error) => {
      console.error("Erro ao assinar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível realizar a assinatura",
        variant: "destructive",
      })
    }
  })

  // Mutation para cancelar assinatura
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await api.post(`/subscriptions/cancel/${subscriptionId}`)
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Assinatura cancelada com sucesso",
        variant: "default",
      })

      // Invalidar cache das assinaturas para refetch automático
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
    },
    onError: (error) => {
      console.error("Erro ao cancelar assinatura:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura",
        variant: "destructive",
      })
    }
  })

  // Funções wrapper para manter compatibilidade
  const subscribeToPlan = (planId: string, paymentMethod: string, cardData?: any) => {
    return subscribeToPlanMutation.mutateAsync({ planId, paymentMethod, cardData })
  }

  const cancelSubscription = (subscriptionId: string) => {
    return cancelSubscriptionMutation.mutateAsync(subscriptionId)
  }


  return {
    // Dados
    plans,
    subscription,
    transactionsSubscriptions,

    // Estados de loading
    loading,
    isLoadingPlans,
    isLoadingSubscription,

    // Estados das mutations
    isSubscribing: subscribeToPlanMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,

    // Erros
    plansError,
    subscriptionError,

    // Funções (mantidas para compatibilidade)
    subscribeToPlan,
    cancelSubscription,

    // Mutations (para uso direto se necessário)
    subscribeToPlanMutation,
    cancelSubscriptionMutation,
  }
}
