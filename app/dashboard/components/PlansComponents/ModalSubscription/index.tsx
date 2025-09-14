import React, { useCallback, useEffect, useState, useRef } from "react";
import { CreditDataForm, CreditDataRefProps } from "./steps/CreditDataForm";
import { plansAttributes, tabProps } from "../../interfaces";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { toast } from "@/hooks/use-toast";
import { copyOf } from "@/lib/generalServices";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { MessageCircle } from "lucide-react";
import { ContentOrLoading } from "@/components/ContentOrLoading";
import { ChoosePlan } from "./steps/ChoosePlan";
import { Button } from "@/components/ui/button";

interface IModalResponsibleProps {
    onCancel: Function
    onSave: Function
    default_plan_id: any
    openModal: boolean
    backgroundVisible?: boolean
}

const initialsTabs: tabProps[] = [
    { label: "1. Escolha seu Plano", canClick: false, open: false },
    { label: "2. Dados do Pagamento", canClick: false, open: false }
]

 /* ------------------------------------ */

 const tertiary = "#07C5A6";
 const four = "#394F8F";
 
 const fail = "#FF6B6B";
 const success = "#52C41A";
 const info = "#FAAD14";
 
 const gray = "#DBDBDB";
 const white = "#FFF";
 const backScan = "#BDE5F3";
 
 const inactiveItens = {
     light: "#3a3a3a",
     dark: "#8A8A8A",
   };
 
   export const background = {
     light: "#f8f8f8",
     dark: "#1B191B",
   };
 
   export const secondary = {
     light: "#7041ff",
     dark: "#7041ff",
   };

   export const borderColors = {
    light: "#CCCCCC",
    dark: "rgb(68 68 68)",
  };
 
   /* ------------------------------------ */

export const ModalSubscription: React.FC<IModalResponsibleProps> = (props) => {
    const { onCancel, onSave, openModal, default_plan_id = null } = props

    const [step, setStep] = useState(default_plan_id ? 2 : 1)
    const [tabs, setTabs] = useState<tabProps[]>(initialsTabs)
    const [planSelected, setPlanSelected] = useState<string | null>(default_plan_id)

    const buttonSubmitRef = useRef<HTMLButtonElement>(null)
    const paymentFormRef = useRef<CreditDataRefProps>(null)

    const {plans, loading} = useSubscriptions()

    const handleGoToNextStep = useCallback(async (nextStep: any) => {
        if (nextStep === 3) paymentFormRef.current?.forceSubmit()
        else if (nextStep === 2) {
            if (!planSelected) {
                toast({
                    title: "Selecione um plano!",
                    variant: 'destructive'
                })
            }
            else setStep(nextStep)
        }
    }, [planSelected, paymentFormRef])

    useEffect(() => {
        setTabs((tabs) => {
            const newTabs: tabProps[] = copyOf(tabs)
            newTabs.forEach((tab, index) => {
                newTabs[index].open = index === (step - 1)
                newTabs[index].canClick = index <= (step - 1)
            })
            newTabs[0].canClick = true
            newTabs[1].canClick = !!planSelected
            return newTabs
        })
    }, [step, planSelected])

    return (
        <Dialog open={openModal} >
            <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
                <div >

                    <DialogHeader className="text-center pb-4 sm:pb-6">
                        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                            </div>
                        </div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">
                            Plano de Assinatura da sua Empresa"
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
                            Selecione o melhor plano de assinatura para a sua Empresa
                        </DialogDescription>
                    </DialogHeader>

                    <ContentOrLoading loading={loading}>
                    display: flex;
                        <div className="flex flex-col overflow-auto flex-1 p5">
                            {/* <div>
                                <Tabs
                                    tabs={tabs}
                                    onChange={(index: any) => setStep(index + 1)}
                                    pos={tabs.findIndex((tab) => tab.open)}
                                />
                            </div>
 */}
                            <div style={{ display: step === 1 ? "flex" : "none", width: "100%" }}>
                                <ChoosePlan
                                    plans={plans}
                                    planSelected={planSelected}
                                    setPlanSelected={setPlanSelected}
                                />
                            </div>

                            <div style={{ display: step === 2 ? "flex" : "none" }}>
                                <CreditDataForm
                                    onSucess={() => onSave()}
                                    amount={Number(plans.find((plan) => plan.id === planSelected)?.value) ?? 0}
                                    onChangePlan={() => setStep(1)}
                                    default_plan={plans.find((plan) => plan.id === planSelected)}
                                    ref={paymentFormRef}
                                />
                            </div>

                            <button
                                ref={buttonSubmitRef}
                                type="submit"
                                style={{ display: "none" }}
                            />
                        </div>
                    </ContentOrLoading>

                    <div className="flex justify-between flex-wrap p-5 gap-2.5 border-t-2 border-t-border" >
                        <div style={{ height: "100%", flex: window.innerWidth <= 587 ? 1 : undefined }}>
                            <Button
                                onClick={() => step === 1 ? onCancel() : setStep((atual) => atual - 1)}
                                color={"#FFF"}
                                style={{ padding: 8, minWidth: 210, fontSize: 14, alignItems: "center" }}
                                children="Voltar"
                                variant='outline'
                            />
                        </div>
                        <div style={{ height: "100%", flex: window.innerWidth <= 587 ? 1 : undefined }}>
                            <Button
                                onClick={() => handleGoToNextStep(step + 1)}
                                color={"#FFF"}
                                disabled={planSelected === null}
                                style={{ padding: 8, minWidth: 210, fontSize: 14 }}
                                children={step === 1 ? "Próximo" : "Confirmar pagamento"}
                            />
                        </div>
                    </div>

                </div>
            </DialogContent>

        </Dialog>
    )
}