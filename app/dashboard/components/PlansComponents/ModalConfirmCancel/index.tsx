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
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-hidden flex flex-col">
                {!loading && (
                    <>
                        <DialogHeader className="flex-shrink-0 pb-3">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                                    Cancelar Assinatura
                                </DialogTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCancel()}
                                    className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0"
                                >
                                    <TiDelete size={18} className="text-gray-500" />
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-1">
                            {/* Aviso de Consequências */}
                            <Alert className="border-red-200 bg-red-50">
                                <MdWarning className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <AlertDescription className="text-sm sm:text-sm text-red-800 leading-relaxed">
                                    <strong>Esta é uma ação irreversível!</strong>
                                    <br />
                                    Cancelando sua assinatura, novas cobranças não serão geradas e você perderá os benefícios do plano, 
                                    incluindo a perda de visibilidade para os clientes da plataforma.
                                    Porém seus dados serão mantidos e você poderá reativar sua assinatura a qualquer momento.
                                </AlertDescription>
                            </Alert>

                            {/* Confirmação por Texto */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="text-sm sm:text-sm text-gray-700">
                                    Por favor digite <span className="font-bold text-red-600">CANCELAR</span> para confirmar:
                                </div>
                                <Input 
                                    value={textConfirm}
                                    onChange={(e) => setTextConfirm(e.target.value)}
                                    placeholder="Digite CANCELAR aqui"
                                    className="text-center font-mono text-sm sm:text-sm uppercase tracking-wider"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Botões fixos na parte inferior */}
                        <div className="flex-shrink-0 space-y-2 sm:space-y-3 pt-3 border-t border-gray-100">
                            <Button
                                disabled={textConfirm.toUpperCase() !== 'CANCELAR'}
                                variant="destructive"
                                size="lg"
                                className="w-full text-xs sm:text-sm font-medium py-2 sm:py-3"
                                onClick={() => onConfirm()}
                            >
                                <span className="text-center leading-tight">
                                    Eu entendo as consequências, <br /> cancelar minha assinatura
                                </span>
                            </Button>   

                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full text-xs sm:text-sm py-2 sm:py-3"
                                onClick={() => onCancel()}
                            >
                                Manter assinatura
                            </Button>
                        </div>
                    </>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
                        <LoadingSpinner />
                        <p className="text-xs sm:text-sm text-gray-600 text-center px-4">
                            Cancelando sua assinatura...
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}