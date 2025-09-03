"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MoreVertical,
  Send,
  CheckCircle,
  DollarSign,
  MapPin,
  MessageCircle
} from "lucide-react";
import { IRequestService } from "@/lib/types";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderType: "client" | "provider";
}

interface ChatSectionProps {
  selectedRequest: IRequestService | null;
  showChat: boolean;
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onBackToRequests: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
  messages: Message[];
}

export function ChatSection({
  selectedRequest,
  showChat,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onBackToRequests,
  getStatusBadge,
  messages
}: ChatSectionProps) {
  return (
    <div className={`${!showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-2/3 bg-white`}>
      {selectedRequest ? (
        <>
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={onBackToRequests}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedRequest?.provider?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {selectedRequest?.provider?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedRequest?.provider?.name}</h3>
              <p className="text-sm text-gray-600">{selectedRequest?.service_type}</p>
            </div>
            {getStatusBadge(selectedRequest?.status)}
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </div>

          <div className="p-3 bg-primary/10 border-b border-yellow-200 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">Detalhes da Solicitação</span>
            </div>
            <p className="text-yellow-700 mb-2">{selectedRequest?.description}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              {selectedRequest?.value && Number(selectedRequest?.value) > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {selectedRequest?.value}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedRequest?.address}
              </span>
            </div>
          </div>

          <div
            className="flex-1 bg-opacity-50"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23f0f0f0" fillOpacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <ScrollArea className="h-full p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${message.senderType === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${message.senderType === "client"
                      ? "bg-primary font-medium rounded-br-md"
                      : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${message.senderType === "client" ? "text-accent-foreground" : "text-accent-foreground"
                        }`}
                    >
                      <span className="text-xs">
                        {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.senderType === "client" && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="p-4 bg-white border-t border-primary">
            <div className="flex items-center gap-2 justify-center">
              <div className="flex-1 bg-primary/10 rounded-full px-4 py-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                  className="border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                onClick={onSendMessage}
                size="sm"
                className="bg-primary hover:bg-secondary rounded-full w-10 h-10 p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" color="#000" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center ">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" color="#db9d01" />
            <h3 className="text-lg font-medium mb-2">Bem-vindo ao Listão</h3>
            <p>Selecione uma conversa para começar a conversar com um prestador</p>
          </div>
        </div>
      )}
    </div>
  );
}
