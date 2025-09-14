import React, { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface IModalConfirmCancel {
    open: boolean
    loading: boolean
    onCancel: Function
    onConfirm: Function
}

export const ModalConfirmCancel: React.FC<IModalConfirmCancel> = (props) => {
    const { open, onCancel, onConfirm, loading } = props

    const [textConfirm, setTextConfirm] = useState('')

    return (
        <Dialog open={open} /* onClose={() => onCancel()} */>
            <div>
                {!loading &&
                    <>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                <p >
                                    Você tem certeza disso?
                                </p>
                                <div onClick={() => onCancel()} style={{ cursor: "pointer" }}>
                                    <TiDelete color={'#FFF'} size={20} />
                                </div>
                            </div>
                            <div>
                                Está é uma ação irreversível,
                                cancelando sua assinatura novas
                                cobranças não serão geradas e
                                você perderá acesso a plataforma. Porém
                                seus dados serão mantidos e você poderá
                                reativar sua assinatura a qualquer momento.
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexDirection: "column", width: "100%", marginBottom: 10 }}>
                            <div>Por favor digite <b>CANCELAR</b> para confirmar</div>
                            <Input onChange={(value: any) => setTextConfirm(value)} style={{ textTransform: "uppercase" }} />
                        </div>
                        <Button
                            disabled={textConfirm.toUpperCase() !== 'CANCELAR'}
                            color='#FFF'
                            style={{ width: "100%", fontSize: 16 }}
                            onClick={() => onConfirm()}
                        >
                            Eu entendo as consequências, cancelar minha assinatura
                        </Button>
                    </>
                }
                {loading &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <LoadingSpinner />
                    </div>
                }
            </div>
        </Dialog>
    )
}