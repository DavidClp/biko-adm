"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { IRequestService } from "@/lib/types";

interface ChatHeaderProps {
  selectedRequest: IRequestService | null;
  onBackToRequests: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
  type: "chat-client" | "chat-provider";
}

export function ChatHeader({
  selectedRequest,
  onBackToRequests,
  getStatusBadge,
  type,
}: ChatHeaderProps) {
  if (!selectedRequest) return null;

  return (
    <div className="flex items-center gap-3 p-2 md:p-4 border-b border-gray-200">
      <Button variant="ghost" size="sm" className="md:hidden " onClick={onBackToRequests}>
        <ArrowLeft className="w-5 h-5" />
      </Button>
     
     
      <Avatar className="w-9 h-9 md:w-10 md:h-10">
        <AvatarImage src={type === "chat-client" ? selectedRequest?.client?.avatar: selectedRequest?.provider?.avatar} />
        <AvatarFallback className="bg-green-100 text-green-700">
          {type === "chat-client" ? selectedRequest?.client?.name?.charAt(0) : selectedRequest?.provider?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 hidden md:block">
        <h3 className="font-semibold text-gray-900">{type === "chat-client" ? selectedRequest?.client?.name : selectedRequest?.provider?.name}</h3>
        <p className="text-sm text-gray-600">{selectedRequest?.service_type}</p>
      </div>
      <div className="md:hidden flex-1">
        <h3 className="font-semibold text-gray-900">{type === "chat-client" ? selectedRequest?.client?.name : selectedRequest?.provider?.name}</h3>
      </div>
      <div className="md:hidden flex-1 items-center justify-end flex">
        {getStatusBadge(selectedRequest?.status)}
      </div>
      <div className="hidden md:flex items-end">
        {getStatusBadge(selectedRequest?.status)}
      </div>
      {/* <MoreVertical className="w-5 h-5 text-gray-500" /> */}
    </div>
  );
}
