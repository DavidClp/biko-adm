"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { IRequestService } from "@/lib/types";
import { getStatusBadge } from "@/components/getStatusRequestBadge";

interface ChatHeaderProps {
  selectedRequest: IRequestService | null;
  onBackToRequests: () => void;
  type: "chat-client" | "chat-provider";
  isUserOnline: (userId: string) => boolean;
  onSendProposal?: () => void;
}

export function ChatHeader({
  selectedRequest,
  onBackToRequests,
  type,
  isUserOnline,
  onSendProposal,
}: ChatHeaderProps) {
  if (!selectedRequest) return null;

  // Função para renderizar status online/offline
  const renderOnlineStatus = () => {
    if (!selectedRequest?.provider?.userId) return null;

    const isOnline = isUserOnline(selectedRequest.provider.userId);
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center p-2 md:p-4 border-b border-gray-200">
      <Button variant="ghost" size="sm" className="md:hidden" onClick={onBackToRequests}>
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <Avatar className="w-9 h-9 left-[-3px] md:left-0 md:w-10 md:h-10">
        <AvatarImage src={type === "chat-client" ? selectedRequest?.client?.avatar : selectedRequest?.provider?.avatar} />
        <AvatarFallback className="bg-green-100 text-green-700">
          {type === "chat-client" ? selectedRequest?.client?.name?.charAt(0) : selectedRequest?.provider?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 hidden md:block ">
        <h3 className="font-semibold text-gray-900">{type === "chat-client" ? selectedRequest?.client?.name : selectedRequest?.provider?.name}</h3>
        <p className="text-sm text-gray-600">{selectedRequest?.service_type}</p>
      </div>
      <div className="md:hidden flex-1">
        <h3 className="font-semibold break-words text-nowrap text-sm text-gray-900">{type === "chat-client" ? selectedRequest?.client?.name : selectedRequest?.provider?.name}</h3>
        {/*   {renderOnlineStatus()} */}
      </div>

      {type === "chat-client" && (
        <Button variant="secondary" size="sm" onClick={onSendProposal}>
          Enviar Proposta
        </Button>
      )}

      {type === "chat-client" && (
        <Button variant="secondary" size="sm" onClick={onCancelProposalByProvider}>
          Cancelar Proposta
        </Button>
      )}

      {type === "chat-provider" && (
        <Button variant="secondary" size="sm" onClick={onCancelProposalByClient}>
          Cancelar Proposta
        </Button>
      )}
      {/* <MoreVertical className="w-5 h-5 text-gray-500" /> */}
    </div>
  );
}
