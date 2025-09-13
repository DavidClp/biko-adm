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
import { EmojiPicker } from "@/components/emoji-picker";
import { Textarea } from "@/components/ui/textarea";
import { MessageComponent } from "./message-component";
import { CancelRequestModal } from "@/components/cancel-request-modal";
import { useRequestService } from "@/hooks/use-requests-services";

interface ChatSectionProps {
  selectedRequest: IRequestService | null;
  showChat: boolean;
  onBackToRequests: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
  onNewMessage?: (msg: Message) => void;
  onRequestCancelled?: () => void;
}

export function ChatSection({
  selectedRequest,
  showChat,
  onBackToRequests,
  getStatusBadge,
  onNewMessage,
  onRequestCancelled,
}: ChatSectionProps) {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { cancelRequestMutation } = useRequestService({ clientId: user?.id });

  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    hasMoreMessages,
    inputRef,
    messagesContainerRef,
    send,
    loadMoreMessages,
    handleTyping,
    stopTyping,
    scrollToBottom,
    isUserOnline,
    getTypingUsersInRoom
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.provider?.userId,
    providerId: selectedRequest?.provider?.id,
    onNewMessage: (msg: Message) => {
      onNewMessage?.(msg);
    },
  });

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
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleCancelRequest = useCallback(() => {
    if (!selectedRequest?.id) return;
    
    cancelRequestMutation.mutate({
      requestId: selectedRequest.id,
      cancelledBy: 'client',
      userName: user?.name,
      providerId: selectedRequest.provider?.userId,
      clientId: selectedRequest.client?.userId,
    }, {
      onSuccess: () => {
        setShowCancelModal(false);
        onRequestCancelled?.();
      }
    });
  }, [selectedRequest?.id, cancelRequestMutation, onRequestCancelled, user?.name]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [newMessage]);


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

  return (
    <div className={`${!showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-2/3 h-full bg-white`}>
      {selectedRequest ? (
        <>
          <ChatHeader
            selectedRequest={selectedRequest}
            onBackToRequests={onBackToRequests}
            type="chat-provider"
            isUserOnline={isUserOnline}
            onCancelByClient={() => setShowCancelModal(true)}
          />

          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <RequestDetailsModal
              selectedRequest={selectedRequest}
            />
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
                
                return <MessageComponent message={message} request={selectedRequest} isOwnMessage={isOwnMessage} />
              })}

              {/* Indicador de digitação */}
            {/*   {renderTypingIndicator()} */}
            </div>
          </div>

          <div className="p-4 bg-white border-t border-primary">
            <div className="flex items-center gap-2">
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

              <div className="flex-1 bg-primary/10 rounded-full px-4 py-2">
                <Textarea
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  ref={inputRef}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  className="min-h-[1.5rem] max-h-[10rem] overflow-y-auto whitespace-pre-wrap break-all resize-none border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
              </div>

              <Button
                onClick={handleSend}
                size="sm"
                className="bg-primary hover:bg-secondary rounded-full w-10 h-10 p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" color="#000" />
              </Button>
            </div>

            {showEmojiPicker && (
              <div className={`absolute bottom-23 md:bottom-16 left-4 z-50 w-full md:w-auto`}>
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onEmojiSelect={(emoji) => {
                    setNewMessage(prev => prev + emoji);
                  }}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          <CancelRequestModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelRequest}
            isLoading={cancelRequestMutation.isPending}
            requestType="client"
          />
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
