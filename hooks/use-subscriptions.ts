import { useState, useEffect, useCallback } from "react"
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

export function useSubscriptions() {
  const { user } = useAuth()

  const [plans, setPlans] = useState<IPlan[]>([])
  const [subscription, setSubscription] = useState<subscriptionsAttributes | null>(null)
  const [transactionsSubscriptions, setTransactionsSubscriptions] = useState<transactionsAttributes[]>([])

  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get("/plans")
      setPlans(response.data || [])
      return response.data || []
    } catch (error) {
      console.error("Erro ao buscar planos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive",
      })
      return []
    }
  }, [])

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await api.get("/subscriptions", {
        params: {
          provider_id: user?.provider?.id
        }
      })

      //@ts-ignore
      setSubscription(response?.subscription as subscriptionsAttributes)
      //@ts-ignore
      setTransactionsSubscriptions(response?.transactions as transactionsAttributes[])

      return response || []
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as assinaturas",
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const subscribeToPlan = async (planId: string, paymentMethod: string, cardData?: any) => {
    try {
      const subscriptionData = {
        plan_id: planId,
        payment_method: paymentMethod,
        ...(paymentMethod === "credit_card" && { card_data: cardData })
      }

      const response = await api.post("/subscriptions", subscriptionData)

      toast({
        title: "Sucesso!",
        description: "Assinatura realizada com sucesso",
        variant: "default",
      })

      // Atualizar lista de assinaturas
      await fetchSubscription()
      return response
    } catch (error) {
      console.error("Erro ao assinar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível realizar a assinatura",
        variant: "destructive",
      })
      throw error
    }
  }

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      await api.delete(`/subscriptions/${subscriptionId}`)
      toast({
        title: "Sucesso!",
        description: "Assinatura cancelada com sucesso",
        variant: "default",
      })

      // Atualizar lista de assinaturas
      await fetchSubscription()
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura",
        variant: "destructive",
      })
      throw error
    }
  }


  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans()
      fetchSubscription()
    }
  }, [])

  return {
    plans,
    subscription,
    transactionsSubscriptions,
    loading,
    fetchPlans,
    fetchSubscription,
    subscribeToPlan,
    cancelSubscription,
  }
}
