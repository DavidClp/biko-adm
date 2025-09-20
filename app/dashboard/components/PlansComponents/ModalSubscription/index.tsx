import React, { useCallback, useEffect, useState, useRef } from "react";
import { CreditDataForm, CreditDataRefProps } from "./steps/CreditDataForm";
import { plansAttributes, tabProps } from "../../interfaces";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { toast } from "@/hooks/use-toast";
import { copyOf } from "@/lib/generalServices";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { ContentOrLoading } from "@/components/ContentOrLoading";
import { ChoosePlan } from "./steps/ChoosePlan";
import { Button } from "@/components/ui/button";
import { CustomTabs } from "./components/CustomTabs";

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

    const { plans, loading } = useSubscriptions()

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
        <Dialog open={openModal} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 md:px-8 md:py-2">
                <div >
                    <DialogHeader className="text-center pb-0 pt-3 sm:pb-2">
                        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                            </div>
                        </div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">
                            Plano de Assinatura
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
                            Selecione o melhor plano de assinatura para você
                        </DialogDescription>
                    </DialogHeader>

                    <ContentOrLoading loading={loading}>
                        <div className="flex flex-col overflow-auto flex-1 p-5">
                            <CustomTabs
                                tabs={tabs}
                                onChange={(index: number) => setStep(index + 1)}
                                pos={tabs.findIndex((tab) => tab.open)}
                            />

                            <div style={{ display: step === 1 ? "flex" : "none", width: "100%", alignItems: "center", justifyContent: "center" }}>
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

                </div>
                <div className="flex justify-center md:justify-between flex-wrap py-5 gap-2.5 border-t-[1px] border-t-[#dee2e6]" >
                    <Button
                        onClick={() => step === 1 ? onCancel() : setStep((atual) => atual - 1)}
                        color={"#FFF"}
                        style={{ padding: 8, minWidth: 210, fontSize: 14, alignItems: "center" }}
                        children="Voltar"
                        variant='outline'
                    />
                    <Button
                        onClick={() => handleGoToNextStep(step + 1)}
                        color={"#FFF"}
                        disabled={planSelected === null}
                        style={{ padding: 8, minWidth: 210, fontSize: 14 }}
                        children={step === 1 ? "Próximo" : "Confirmar pagamento"}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}