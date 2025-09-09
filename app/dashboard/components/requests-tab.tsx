"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Send,
  ArrowLeft,
  Users,
  Smile,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"
import { useIsMobile } from "@/hooks/use-mobile"
import { useChat } from "@/hooks/use-chat"
import { IRequestService, Message } from "@/lib/types"
import { socket } from "@/lib/socket"
import { RequestDetailsModal } from "@/app/my-requests/components/request-details-modal"
import { formatCurrency, formatDate, formatDateWithTime } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmojiPicker } from "@/components/emoji-picker"

export function RequestsTab() {
  // Messaging state for internal chat system
  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)
  const [showChat, setShowChat] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({})
  const [newRequests, setNewRequests] = useState<IRequestService[]>([])

  const router = useRouter()
  const isMobile = useIsMobile()
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const { getRequestsByProvider } = useRequestService({ providerId: user?.provider?.id })
  const { data: requestsList, isLoading: isLoadingRequests } = getRequestsByProvider;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aceito
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Star className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Function to handle order status changes
  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
    // Simulate API call to update order status
    console.log(`Order ${orderId} ${action}ed`)
  }

  const handleSelectRequest = (request: IRequestService) => {
    // Limpar mensagens não lidas da solicitação selecionada
    setUnreadMessages(prev => ({
      ...prev,
      [request.id]: 0
    }))

    setNewRequests(prev => prev.filter(req => req.id !== request.id))

    if (isMobile) {
      // No mobile, redirecionar para página de chat dedicada
      router.push(`/chat/${request.id}`)
    } else {
      // No desktop, usar o chat inline
      setSelectedRequest(request)
      setShowChat(true)
    }
  }

  const handleBackToRequests = () => {
    setShowChat(false)
    setSelectedRequest(null)
  }

  // Hook de chat centralizado com funcionalidades completas
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
    isUserOnline,
    getTypingUsersInRoom
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.client?.userId,
    providerId: selectedRequest?.provider?.id,
    onNewMessage: (msg: Message) => {
      // Incrementar contador de mensagens não lidas para outras solicitações
      setUnreadMessages(prev => ({
        ...prev,
        [msg.request_id]: (prev[msg.request_id] || 0) + 1
      }))
    },
    onUserOnline: (userId: string, userName: string) => {
      console.log(`${userName} está online`);
    },
    onUserOffline: (userId: string) => {
      console.log(`Usuário ${userId} está offline`);
    }
  })

  useEffect(() => {
    if (!user?.id || !user?.provider?.id) return

    socket.auth = { userId: user?.id }
    socket.connect()

    // Evento para nova solicitação
    socket.on("request:new", (newRequest: IRequestService) => {
      if (newRequest?.providerId === user?.provider?.id) {
        // Invalidar query para recarregar a lista
        queryClient.invalidateQueries({ queryKey: ['requestsByProvider', user?.provider?.id] })

        // Adicionar à lista de novas solicitações para animação
        setNewRequests(prev => [newRequest, ...prev])
      }
    })

    return () => {
      socket.off("request:new")
      socket.disconnect()
    }
  }, [user?.id, user?.provider?.id, queryClient])

  useEffect(() => {
    const unreadMessagesMap = requestsList?.reduce((acc, request) => {
      if (request?.id && request?.unreadMessages !== undefined) {
        acc[request.id] = request.unreadMessages
      }
      return acc
    }, {} as Record<string, number>) || {}
    setUnreadMessages(unreadMessagesMap)
  }, [requestsList])

  return (
    <div className="flex h-[calc(100vh-200px)] lg:h-auto lg:grid lg:grid-cols-2 lg:gap-6">
      {/* Orders List */}
      <div className={`${showChat && !isMobile ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-auto`}>
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Solicitações de Orçamento
                  {Object.values(unreadMessages).reduce((total, count) => total + count, 0) > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {Object.values(unreadMessages).reduce((total, count) => total + count, 0)}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Clique em uma solicitação para ver a conversa</CardDescription>
              </div>
              {newRequests.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
                  {newRequests.length} nova{newRequests.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="space-y-3 h-[calc(100vh-300px)] pr-3">
              {requestsList?.map((request) => {
                const isNewRequest = newRequests.some(newReq => newReq.id === request.id);

                const isUnreadRequest = unreadMessages[request.id] || 0 > 0

                const unreadCount = unreadMessages[request.id] || 0

                return (
                  <Card
                    key={request.id}
                    className={`cursor-pointer transition-all duration-300 shadow-md hover:bg-muted/50 mb-3 ${selectedRequest?.id === request?.id ? "ring-primary border-none" : ""} 
                      ${isNewRequest ? " ring-green-500 border-green-200 bg-green-50/50" : ""}
                      ${isUnreadRequest ? "ring-yellow-500 border-yellow-200 bg-yellow-50/50" : ""}
                      `}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <CardContent>
                      <div className="flex flex-col items-start justify-between mb-2 gap-2">
                        <div className="flex justify-between w-full items-center">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{request?.client?.name}</h3>
                            {isNewRequest && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Nova
                              </Badge>
                            )}
                            {unreadCount > 0 && (
                              <div className="relative mt-1">
                                <MessageSquare className="h-6 w-6 text-primary" />
                                <Badge
                                  variant="destructive"
                                  className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                                >
                                  {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request?.status)}
                          </div>
                        </div>
                        <div className="text-right flex w-full justify-between items-center">
                          <p className="text-xs text-muted-foreground mt-1">{request?.service_type}</p>
                          <p className="text-xs text-muted-foreground mt-1">{request?.createdAt ? formatDateWithTime(request?.createdAt) : ""}</p>
                        </div>
                      </div>
                      {(request?.status !== "PENDING" && request?.value) && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">{formatCurrency(Number(request?.value))}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface - Only show on desktop */}
      <div className={`${!showChat || isMobile ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-auto`}>
        <Card className="flex flex-col h-full border-0 shadow-none md:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={handleBackToRequests}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-md">
                  {selectedRequest?.id
                    ? `${requestsList?.find((o) => o.id === selectedRequest?.id)?.client?.name}`
                    : "Selecione uma solicitação"}
                </CardTitle>
              </div>
            </div>
            {selectedRequest?.id && (
              <div className="p-3 bg-gray-50 border-b border-gray-200 mt-2">
                <RequestDetailsModal
                  selectedRequest={selectedRequest}
                  getStatusBadge={getStatusBadge}
                />
              </div>
            )}
          </CardHeader>

          {selectedRequest?.id ? (
            <>
              <CardContent ref={messagesContainerRef} className="flex-1 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {/* Indicador de carregamento para mais mensagens */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
                          className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${isOwnMessage
                            ? "bg-primary font-medium rounded-br-md"
                            : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"
                              }`}
                          >
                            <span className="text-xs">
                              {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message?.viewed && isOwnMessage && <CheckCircle className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Indicador de digitação */}
                  {getTypingUsersInRoom().length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>
                        {getTypingUsersInRoom().length === 1
                          ? `${getTypingUsersInRoom()[0].userName} está digitando...`
                          : `${getTypingUsersInRoom().length} pessoas estão digitando...`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-4 ">
                {/*   {requestsList?.find((o) => o.id === selectedOrder)?.status === "PENDING" && (
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOrderAction(selectedOrder, "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Recusar
                </Button>
                <Button size="sm" onClick={() => handleOrderAction(selectedOrder, "accept")}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aceitar
                </Button>
              </div>
            )}
 */}
                <div className="p-4 bg-white border-t border-primary">
                  <div className="flex items-center gap-2 justify-center">
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
                      <Input
                        placeholder="Digite uma mensagem..."
                        value={newMessage}
                        ref={inputRef}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                          }
                        }}
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
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma solicitação para iniciar a conversa</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}