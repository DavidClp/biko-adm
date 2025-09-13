"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface CancelRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  requestType: "client" | "provider";
}

export function CancelRequestModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  requestType,
}: CancelRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Cancelar Solicitação
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {requestType === "client" 
                  ? "Tem certeza que deseja cancelar esta solicitação? Esta ação não pode ser desfeita."
                  : "Tem certeza que deseja cancelar esta proposta? Esta ação não pode ser desfeita."
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-700">
            {requestType === "client"
              ? "Ao cancelar, a solicitação será marcada como cancelada e o prestador será notificado."
              : "Ao cancelar, a proposta será marcada como cancelada e o cliente será notificado."
            }
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Não, manter
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Cancelando..." : "Sim, cancelar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
