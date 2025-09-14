"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IPlan, useSubscriptions } from "@/hooks/use-subscriptions"
import {
  Star,
  CreditCard,
  Receipt,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Plus,
  Crown,
  Zap,
  Shield,
  Clock,
} from "lucide-react"
import { ContentOrLoading } from "@/components/ContentOrLoading"
import { SubscriptionCard } from "./PlansComponents/SubscriptionCard"
import { TransactionList } from "./PlansComponents/TransactionList"
import { ModalSubscription } from "./PlansComponents/ModalSubscription"
import { ModalConfirmCancel } from "./PlansComponents/ModalConfirmCancel"
import { toast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export function SubscriptionsTab() {
  const {
    plans,
    subscription,
    transactionsSubscriptions,
    loading,
    subscribeToPlan,
    cancelSubscription,
    fetchSubscription
  } = useSubscriptions()

  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null)
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  })


  const [openModal, setOpenModal] = useState(false)
  const [changePlan, setChangePlan] = useState(false)
  const [openCancelSubscription, setOpenCancelSubscription] = useState(false)
  const [loadingCancelSubscription, setLoadingCancelSubscription] = useState(false)
  const [transaction_selected, setTransactionSelected] = useState<string | null>(null)


  const onSaveSubscription = useCallback(async (transaction_id: string) => {
    /* notify("Compra de nova assinatura realizada!", "success") */
    toast({
      title: "Compra de nova assinatura realizada!",
      description: "Compra de nova assinatura realizada!",
      variant: "default",
    })
    setOpenModal(false)

    await fetchSubscription()
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
      <h1>
        <div className="flex flex-col">{/* column */}
          <h4>Assinatura</h4>
          {/*    <div className="flex gap-2.5 items-center justify-between flex-wrap pb-2.5 border-2 border-[#CCCCCC]">
                    {!_wallet.loading_all ?
                        <div className="flex flex-col gap-2.5 items-center flex-wrap">
                            <div className="flex">
                                <SubTitle>Última atualização realizada em <b>{correctDateDashboard(_wallet.updatedAt)}</b></SubTitle>
                                <ContainerReload onClick={() => search()}>
                                    <AiOutlineReload />
                                </ContainerReload>
                            </div>
                            <div style={{ fontSize: 14, whiteSpace: "nowrap" }}>

                            </div>
                        </div>
                        :
                        <Line>
                            <SubTitle>Atualizando dados da sua assinatura</SubTitle>
                            <CircularProgress
                                size={10}
                                variant="indeterminate"
                                style={{ color: secondary[theme] }}
                            />
                        </Line>
                    }
                </div> */}
        </div>
      </h1>

      <ContentOrLoading loading={loading} text="Buscando assinatura da empresa">
        <div className="flex flex-1 h-full w-full items-center justify-center">
          {!subscription?.id &&
            <div className="flex flex-col gap-2.5 items-center justify-center">
              {/*  <img src={subscriptionImage} style={{ maxWidth: '30vh', marginBottom: '60px' }} /> */}

              <p className="font-[22px] italic">
                Empresa ainda não possui uma assinatura
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
            <div className="flex flex-col gap-5 pt-5 w-full">
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
