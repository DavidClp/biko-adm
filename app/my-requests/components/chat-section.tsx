"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  CheckCircle,
  MessageCircle,
  Loader2,
  MoreHorizontal,
  Smile,
  Paperclip,
  Phone,
  Video
} from "lucide-react";
import { IRequestService } from "@/lib/types";
import { Message } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { RequestDetailsModal } from "./request-details-modal";
import { ChatHeader } from "./chat-header";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  console.log("showEmojiPicker", showEmojiPicker);
  // Hook de chat com todas as funcionalidades
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    hasMoreMessages,
    onlineUsers,
    typingUsers,
    isTyping,
    unreadCount,
    inputRef,
    messagesContainerRef,
    send,
    loadMoreMessages,
    handleTyping,
    stopTyping,
    scrollToBottom,
    scrollToTop,
    isUserOnline,
    getTypingUsersInRoom
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.provider?.userId,
    providerId: selectedRequest?.provider?.id,
    onNewMessage: (msg: Message) => {
      // Notificar sobre nova mensagem de outra conversa
      console.log("Nova mensagem recebida:", msg);
    },
    onUserOnline: (userId: string, userName: string) => {
      console.log(`${userName} está online`);
    },
    onUserOffline: (userId: string) => {
      console.log(`Usuário ${userId} está offline`);
    }
  });

  // Função para enviar mensagem
  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return;
    send();
  }, [newMessage, send]);

  // Função para lidar com teclas pressionadas
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Função para lidar com mudanças no input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
  }, [handleTyping]);

  // Função para lidar com scroll para carregar mais mensagens
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !isLoading) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoading, loadMoreMessages]);

  // Effect para scroll automático quando há novas mensagens
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Effect para parar indicador de digitação quando input está vazio
  useEffect(() => {
    if (!newMessage.trim()) {
      stopTyping();
    }
  }, [newMessage, stopTyping]);

  // Função para renderizar indicador de digitação
  const renderTypingIndicator = () => {
    const typingUsersInRoom = getTypingUsersInRoom();
    if (typingUsersInRoom.length === 0) return null;

    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span>
          {typingUsersInRoom.length === 1 
            ? `${typingUsersInRoom[0].userName} está digitando...`
            : `${typingUsersInRoom.length} pessoas estão digitando...`
          }
        </span>
      </div>
    );
  };

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
    <div className={`${!showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-2/3 h-full bg-white`}>
      {selectedRequest ? (
        <>
          <ChatHeader
            selectedRequest={selectedRequest}
            onBackToRequests={onBackToRequests}
            getStatusBadge={getStatusBadge}
            type="chat-provider"
          />

          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <RequestDetailsModal
              selectedRequest={selectedRequest}
              getStatusBadge={getStatusBadge}
            />
            {renderOnlineStatus()}
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 mb-4 bg-opacity-50 overflow-y-auto"
            onScroll={handleScroll}
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23f0f0f0" fillOpacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <div className="h-full p-4">
              {/* Indicador de carregamento para mais mensagens */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {/* Botão para carregar mais mensagens */}
              {hasMoreMessages && !isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMoreMessages}
                    className="text-xs"
                  >
                    Carregar mais mensagens
                  </Button>
                </div>
              )}

              {/* Mensagens */}
              {messages?.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${
                        isOwnMessage
                          ? "bg-primary font-medium rounded-br-md"
                          : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"
                        }`}
                      >
                        <span className="text-xs">
                          {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message?.viewed && isOwnMessage && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Indicador de digitação */}
              {renderTypingIndicator()}
            </div>
          </div>

          {/* Área de input com funcionalidades modernas */}
          <div className="p-4 bg-white border-t border-primary">
            <div className="flex items-center gap-2">
              {/* Botões de ação */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>

              {/* Input de mensagem */}
              <div className="flex-1 bg-primary/10 rounded-full px-4 py-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  ref={inputRef}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Botão de enviar */}
              <Button
                onClick={handleSend}
                size="sm"
                className="bg-primary hover:bg-secondary rounded-full w-10 h-10 p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" color="#000" />
              </Button>

              {/* Menu de opções */}
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Contador de caracteres */}
            {newMessage.length > 0 && (
              <div className="text-xs text-gray-500 mt-2 text-right">
                {newMessage.length}/1000
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" color="#db9d01" />
            <h3 className="text-lg font-medium mb-2">Bem-vindo ao Biko</h3>
            <p>Selecione uma conversa para começar a conversar com um prestador</p>
          </div>
        </div>
      )}
    </div>
  );
}
