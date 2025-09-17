import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPlan } from "@/hooks/use-subscriptions";
import { correctDate2 } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";
import { Description } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
interface IFinishSubscription {
    onCancel: Function
    onConfirm: Function
    openModal: boolean
    backgroundVisible?: boolean
    planSelected: IPlan
}

export const FinishSubscription: React.FC<IFinishSubscription> = (props) => {
    const { onCancel, onConfirm, openModal, backgroundVisible, planSelected } = props

    const [textConfirm, setTextConfirm] = useState("")

    return (
        <Dialog open={openModal} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="max-w-2xl">
                <div>
                    <p>
                        Você tem certeza disso?
                    </p>
                    <Description>
                        Ao assinar um novo plano, você concorda
                        em cancelar o seu plano atual, caso possua algum e
                        em pagar mensalmente a partir do dia <b>{correctDate2(new Date())}</b> o
                        valor de <b>{maskFunctions.currency.mask(planSelected?.value)}</b>, em razão da assinatura
                        do plano <b>{planSelected?.name}</b>.
                    </Description>
                </div>
                <div style={{ display: "flex", gap: 5, flexDirection: "column", width: "100%", marginBottom: 10 }}>
                    <div>
                        Por favor digite <b>PAGAR</b> para confirmar
                    </div>
                    <Input
                        value={textConfirm}
                        onChange={(e) => setTextConfirm(e.target.value)}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Digite PAGAR"
                    />
                </div>
                <Button
                    disabled={textConfirm.toUpperCase() !== "PAGAR"}
                    color="#FFF"
                    style={{ width: "100%", fontSize: 16 }}
                    onClick={() => onConfirm()}
                >
                    Estou ciente, pagar agora
                </Button>
            </DialogContent>
        </Dialog>
    )
}