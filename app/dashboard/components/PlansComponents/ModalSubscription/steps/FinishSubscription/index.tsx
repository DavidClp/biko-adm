import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPlan } from "@/hooks/use-subscriptions";
import { correctDate2 } from "@/lib/generalServices";
import { maskFunctions } from "@/lib/maskServices";
import { Description, DialogContent } from "@radix-ui/react-dialog";
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
        <Dialog /* onClose={() => onCancel()} */ open={openModal} >
            <DialogContent >
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                        <p>
                            Você tem certeza disso?
                        </p>
                        <div onClick={() => onCancel()} style={{ cursor: "pointer" }}>
                            <TiDelete
                                color={"#a00000"}
                                size={20}
                            />
                        </div>
                    </div>
                    <Description>
                        Ao assinar um novo plano, você concorda
                        em cancelar o seu plano atual, caso possua algum e
                        em pagar mensalmente a partir do dia <b>{correctDate2(new Date())}</b> o
                        valor de <b>{maskFunctions.currency.mask(planSelected.value)}</b> por acomodação ativa, em razão da assinatura
                        do plano <b>{planSelected.name}</b>.
                    </Description>
                </div>
                <div style={{ display: "flex", gap: 5, flexDirection: "column", width: "100%", marginBottom: 10 }}>
                    <div>
                        Por favor digite <b>PAGAR</b> para confirmar
                    </div>
                    <Input
                        onChange={(value: any) => setTextConfirm(value)}
                        style={{ textTransform: "uppercase" }}
                    />
                </div>
                <Button
                    disabled={textConfirm.toUpperCase() !== "PAGAR"}
                    color="#FFF"
                    style={{ width: "100%", fontSize: 16 }}
                    onClick={() => onConfirm()}
                    children="Estou ciente, pagar agora"
                />
            </DialogContent>
        </Dialog>
    )
}