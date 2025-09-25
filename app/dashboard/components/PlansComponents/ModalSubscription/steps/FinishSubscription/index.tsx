import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPlan } from "@/hooks/use-subscriptions";
import { correctDate2 } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";
import { Description } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
interface IFinishSubscription {
    onCancel: Function
    onConfirm: Function
    openModal: boolean
    backgroundVisible?: boolean
    planSelected: IPlan
    loading: boolean
}

export const FinishSubscription: React.FC<IFinishSubscription> = (props) => {
    const { onCancel, onConfirm, openModal, backgroundVisible, planSelected, loading } = props

    const [textConfirm, setTextConfirm] = useState("")

    return (
        <Dialog open={openModal} onOpenChange={(open) => !open && !loading && onCancel()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Assinar novo plano</DialogTitle>
                </DialogHeader>
                <div>
                    <p>
                        Você tem certeza disso?
                    </p>
                    <Description>
                        Ao assinar um novo plano, você concorda
                        em em pagar mensalmente a partir do dia <b>{correctDate2(new Date())}</b> o
                        valor de <b>{maskFunctions.currency.mask(planSelected?.value)}</b>, em razão da assinatura
                        do plano <b>{planSelected?.name}</b>.
                    </Description>
                </div>
                {/*  <div style={{ display: "flex", gap: 5, flexDirection: "column", width: "100%", marginBottom: 10 }}>
                    <div>
                        Por favor digite <b>PAGAR</b> para confirmar
                    </div>
                    <Input
                        value={textConfirm}
                        onChange={(e) => setTextConfirm(e.target.value)}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Digite PAGAR"
                    />
                </div> */}
                <Button
                    // disabled={textConfirm.toUpperCase() !== "PAGAR" || loading}
                    color="#FFF"
                    style={{ width: "100%", fontSize: 16, marginTop: 10 }}
                    onClick={() => onConfirm()}
                >
                    Estou ciente, pagar agora
                </Button>
                {loading && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[999] overflow-y-auto">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}