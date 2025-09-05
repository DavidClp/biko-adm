"use client";

import { useEffect, useRef, useState } from "react";
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

import { Message } from "@/lib/types";
import { useMessages } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { socket } from "@/lib/socket";

interface ChatSectionProps {
  selectedRequest: IRequestService | null;
  showChat: boolean;
  onBackToRequests: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function ChatSection({
  selectedRequest,
  showChat,
  onBackToRequests,
  getStatusBadge,
}: ChatSectionProps) {
  const { user } = useAuth();

  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const content = inputRef.current!.value.trim()
    if (!content) return;

    socket.emit("chat:send", { requestId: selectedRequest?.id, toUserId: selectedRequest?.provider?.userId, content })

    inputRef.current!.value = ""
    setNewMessage("")
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll quando mensagens mudam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.auth = { userId: user?.id }
    socket.connect()

    if (selectedRequest?.id) {  
      socket.emit("chat:join", { requestId: selectedRequest?.id })
    }

    socket.on("chat:new_message", (msg: Message) => {
      if (msg.request_id === selectedRequest?.id) {
        setMessages((prev) => [...prev, msg])
      }
    })

    socket.on('chat:load_messages', (data) => {
      setMessages(data?.messages || [])
    });

    socket.on('chat:message_viewed', (message) => {
     setMessages((prev) => prev.map(msg => msg.id === message.id ? { ...msg, viewed: true } : msg))
      console.log('Mensagem marcada como lida:', message);
    });

    return () => {
      socket.disconnect()
      setMessages([])
      processedMessagesRef.current.clear()
    }
  }, [selectedRequest?.id, user?.id])

  const processedMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && 
        lastMessage.sender_id !== user?.id && 
        !lastMessage.viewed) {
      
      const timeoutId = setTimeout(() => {
        socket.emit('chat:viewed', {
          messageId: lastMessage.id,
        });
      }, 1000); 

      return () => clearTimeout(timeoutId);
    }
  }, [messages, user?.id])

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
            ref={messagesContainerRef}
            className="flex-1 mb-10 bg-opacity-50 overflow-y-auto"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23f0f0f0" fillOpacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <div className="h-full p-4">
              {/* isLoadingMessages */false ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando mensagens...</p>
                  </div>
                </div>
              ) : (
                messages?.map((message) => {
                  const isClientMessage = message.sender_id === selectedRequest?.client?.userId;
                  return (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${isClientMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${isClientMessage
                          ? "bg-primary font-medium rounded-br-md"
                          : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${isClientMessage ? "text-accent-foreground" : "text-accent-foreground"
                            }`}
                        >
                          <span className="text-xs">
                            {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message?.viewed && isClientMessage && <CheckCircle className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-primary">
            <div className="flex items-center gap-2 justify-center">
              <div className="flex-1 bg-primary/10 rounded-full px-4 py-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  ref={inputRef}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && send()}
                  className="border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                onClick={send}
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
