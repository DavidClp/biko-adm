"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DollarSign,
    MapPin,
    Info
} from "lucide-react";
import { IRequestService } from "@/lib/types";
import { getStatusBadge } from "@/components/getStatusRequestBadge";

interface RequestDetailsModalProps {
    selectedRequest: IRequestService | null;
}

export function RequestDetailsModal({
    selectedRequest,
}: RequestDetailsModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!selectedRequest) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100"
                >
                    <Info className="w-4 h-4 text-accent-foreground" />
                    <span className="text-sm">Ver detalhes da solicitação</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Detalhes da Solicitação
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {selectedRequest?.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">Localização</p>
                                <p className="text-blue-700">{selectedRequest?.address}</p>
                            </div>
                        </div>

                        {selectedRequest?.value && (
                            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                                <DollarSign className="w-5 h-5 text-secondary" />
                                <div>
                                    <p className="text-sm font-medium ">Valor</p>
                                    <p >{selectedRequest?.value}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-1">Tipo de Serviço</p>
                            <p className="text-gray-700">{selectedRequest?.service_type}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(selectedRequest?.status)}
                            </div>
                        </div>
                    </div>

                    {selectedRequest?.provider && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-2">Prestador de Serviço</p>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={selectedRequest?.provider?.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-green-100 text-green-700">
                                        {selectedRequest?.provider?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">{selectedRequest?.provider?.name}</p>
                                    <p className="text-sm text-gray-600">{selectedRequest?.service_type}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
