"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import { ContentOrLoading } from "@/components/ContentOrLoading"
import { SubscriptionCard } from "./PlansComponents/SubscriptionCard"
import { TransactionList } from "./PlansComponents/TransactionList"
import { ModalSubscription } from "./PlansComponents/ModalSubscription"
import { ModalConfirmCancel } from "./PlansComponents/ModalConfirmCancel"
import { toast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useProvider } from "@/hooks/use-provider"
import { useAuth } from "@/hooks/use-auth"

export function SubscriptionsTab() {
  const { user } = useAuth()

  const {
    subscription,
    transactionsSubscriptions,
    loading,
    fetchSubscription
  } = useSubscriptions()

  const { provider, updateListedStatus } = useProvider({
    providerId: user?.provider?.id
  })

  const [openModal, setOpenModal] = useState(false)
  const [changePlan, setChangePlan] = useState(false)
  const [openCancelSubscription, setOpenCancelSubscription] = useState(false)
  const [loadingCancelSubscription, setLoadingCancelSubscription] = useState(false)
  const [transaction_selected, setTransactionSelected] = useState<string | null>(null)

  const onSaveSubscription = useCallback(async (transaction_id: string) => {
    toast({
      title: "Compra de nova assinatura realizada!",
      description: "Compra de nova assinatura realizada!",
      variant: "default",
    })
    setOpenModal(false)

    await Promise.all([
      updateListedStatus(!provider?.is_listed),
      fetchSubscription()
    ])

    setTransactionSelected(transaction_id)
  }, [fetchSubscription])

  const onClickChangePlan = useCallback(() => {
    setChangePlan(true)
    setOpenModal(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setOpenModal(false)
    setChangePlan(false)
  }, [])

  const handleCancelSubscription = useCallback(async () => {
    setLoadingCancelSubscription(true)
    try {
      await api.post(`/subscriptions/cancel/${subscription?.id}`)

      toast({
        title: "Assinatura cancelada com sucesso!",
        description: "Assinatura cancelada com sucesso!",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Erro ao cancelar assinatura!",
        description: "Erro ao cancelar assinatura!",
        variant: "destructive",
      })
    }

    setOpenCancelSubscription(false);
    setLoadingCancelSubscription(false);
    fetchSubscription();
  }, [fetchSubscription])

  return (
    <div className="">
      <ContentOrLoading loading={loading} text="Buscando assinatura da empresa">
        <div className="flex flex-1 h-full w-full items-center justify-center">
          {!subscription?.id &&
            <div className="flex flex-col gap-2.5 items-center justify-center">
              {/*  <img src={subscriptionImage} style={{ maxWidth: '30vh', marginBottom: '60px' }} /> */}

              <p className="font-[22px] italic">
                Você ainda não possui uma assinatura
              </p>
              <div>
                <Button
                  className="bg-primary text-[#FFF]"
                  onClick={() => setOpenModal(true)}
                >
                  Contratar novo plano
                </Button>
              </div>
            </div>
          }

          {subscription?.id &&
            <div className="flex flex-col gap-5 pt-2 w-full">
              <SubscriptionCard
                openCancelSubscription={() => setOpenCancelSubscription(true)}
                changeCreditCard={() => setOpenModal(true)}
                changePlan={onClickChangePlan}
                subscription={subscription}
              />
              <TransactionList
                transactions={transactionsSubscriptions}
                setTransactionSelected={setTransactionSelected}
                transaction_selected={transaction_selected}
              />
            </div>
          }
        </div>
      </ContentOrLoading>

      {openModal &&
        <ModalSubscription
          onCancel={onCloseModal}
          onSave={onSaveSubscription}
          openModal={openModal}
          default_plan_id={changePlan ? null : subscription?.plan_id}
        />
      }

      {openCancelSubscription &&
        <ModalConfirmCancel
          loading={loadingCancelSubscription}
          onCancel={() => !loadingCancelSubscription ? setOpenCancelSubscription(false) : {}}
          onConfirm={handleCancelSubscription}
          open={openCancelSubscription}
        />
      }

    </div>
  )
}
