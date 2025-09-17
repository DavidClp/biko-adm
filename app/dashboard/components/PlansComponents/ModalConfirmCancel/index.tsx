import React, { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { MdWarning } from 'react-icons/md';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto">
                {!loading && (
                    <>
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Cancelar Assinatura
                                </DialogTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCancel()}
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                >
                                    <TiDelete size={18} className="text-gray-500" />
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Aviso de Consequências */}
                            <Alert className="border-red-200 bg-red-50">
                                <MdWarning className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-sm text-red-800">
                                    <strong>Esta é uma ação irreversível!</strong>
                                    <br />
                                    Cancelando sua assinatura, novas cobranças não serão geradas e você perderá os benefícios do plano, 
                                    incluindo a perda de visibilidade para os clientes da plataforma.
                                    Porém seus dados serão mantidos e você poderá reativar sua assinatura a qualquer momento.
                                </AlertDescription>
                            </Alert>

                            {/* Confirmação por Texto */}
                            <div className="space-y-3">
                                <div className="text-sm text-gray-700">
                                    Por favor digite <span className="font-bold text-red-600">CANCELAR</span> para confirmar:
                                </div>
                                <Input 
                                    value={textConfirm}
                                    onChange={(e) => setTextConfirm(e.target.value)}
                                    placeholder="Digite CANCELAR aqui"
                                    className="text-center font-mono text-sm uppercase tracking-wider"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Botão de Confirmação */}
                            <Button
                                disabled={textConfirm.toUpperCase() !== 'CANCELAR'}
                                variant="destructive"
                                size="lg"
                                className="w-full text-sm sm:text-base font-medium"
                                onClick={() => onConfirm()}
                            >
                                Eu entendo as consequências, cancelar minha assinatura
                            </Button>

                            {/* Botão de Cancelar */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full text-sm sm:text-base"
                                onClick={() => onCancel()}
                            >
                                Manter assinatura
                            </Button>
                        </div>
                    </>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <LoadingSpinner />
                        <p className="text-sm text-gray-600 text-center">
                            Cancelando sua assinatura...
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}