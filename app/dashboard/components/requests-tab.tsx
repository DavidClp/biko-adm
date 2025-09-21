"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  MessageCircleX,
  Star,
  Send,
  Smile,
  ArrowRight,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { MessageComponent } from "@/app/my-requests/components/message-component"
import { getStatusBadge } from "@/components/getStatusRequestBadge"
import { SendProposalModal } from "@/components/send-proposal-modal"
import { CancelRequestModal } from "@/components/cancel-request-modal"
import { ChatHeader } from "@/app/my-requests/components/chat-header"
import { CardNotRequests } from "./card-not-requests"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const { data: requestsList, refetch: refetchRequests } = getRequestsByProvider;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSendModalProposal, setShowSendModalProposal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSelectRequest = (request: IRequestService) => {
    setUnreadMessages(prev => ({
      ...prev,
      [request.id]: 0
    }))

    setNewRequests(prev => prev.filter(req => req.id !== request.id))

    if (isMobile) {
      router.push(`/chat/${request.id}`)
    } else {
      setSelectedRequest(request)
      setShowChat(true)
    }
  }

  const handleBackToRequests = () => {
    setShowChat(false)
    setSelectedRequest(null)

    refetchRequests()
  }

  useEffect(() => {
    if (showChat && selectedRequest?.id) {
      setUnreadMessages(prev => ({
        ...prev,
        [selectedRequest.id]: 0
      }))
    }
  }, [showChat, selectedRequest?.id])

  useEffect(() => {
    if (!showChat && selectedRequest?.id) {
      const timeoutId = setTimeout(() => {
        refetchRequests()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [showChat, selectedRequest?.id, refetchRequests])

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
    sendMessageProposal,
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.client?.userId,
    providerId: selectedRequest?.provider?.id,
    onNewMessage: (msg: Message) => {
      // Este callback é chamado apenas para mensagens de outras conversas
      // O contador já é incrementado pelo evento chat:notification
      console.log("📨 Nova mensagem de outra conversa:", msg.id, "para solicitação:", msg.request_id)
    },
    onUserOnline: (userId: string, userName: string) => {
      console.log(`${userName} está online`);
    },
    onUserOffline: (userId: string) => {
      console.log(`Usuário ${userId} está offline`);
    },
    onRequestStatusUpdate: (data) => {
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: data.status as any,
        budgetStatus: data.budgetStatus as any
      } : null)
    }
  });

  const { sendBudgetRequestMutation, cancelRequestMutation } = useRequestService({ providerId: selectedRequest?.provider?.id });

  const handleSendProposal = useCallback(({ budget, observation }: { budget: number, observation: string }) => {
    sendBudgetRequestMutation.mutate({
      requestId: selectedRequest?.id as string,
      budget: budget,
      observation: observation,
    }, {
      onSuccess: () => {
        sendMessageProposal({ budget, observation })
        setSelectedRequest(prev => ({ ...prev, status: "ON_BUDGET" } as IRequestService))
      }
    })

    setShowSendModalProposal(false)
  }, [selectedRequest?.id, sendBudgetRequestMutation, sendMessageProposal])

  const handleCancelRequest = useCallback(() => {
    if (!selectedRequest?.id) return;

    cancelRequestMutation.mutate({
      requestId: selectedRequest.id,
      cancelledBy: 'provider',
      userName: user?.name,
      providerId: selectedRequest.provider?.userId,
      clientId: selectedRequest.client?.userId,
    }, {
      onSuccess: () => {
        setShowCancelModal(false);
        setShowChat(false);
        setSelectedRequest(null);
        refetchRequests();
      }
    });
  }, [selectedRequest?.id, cancelRequestMutation, refetchRequests, user?.name]);

  useEffect(() => {
    if (!user?.id || !user?.provider?.id) return

    socket.on("request:new", (newRequest: IRequestService) => {
      if (newRequest?.providerId === user?.provider?.id) {
        queryClient.invalidateQueries({ queryKey: ['requestsByProvider', user?.provider?.id] })

        setNewRequests(prev => [newRequest, ...prev])
      }
    })

    // Evento para notificação de nova mensagem
    socket.on("chat:notification", (data: { message: Message, requestId: string, senderId: string }) => {
      console.log("🔔 Notificação de mensagem recebida:", data.message.id, "para solicitação:", data.requestId)

      // Incrementar contador de mensagens não lidas
      setUnreadMessages(prev => ({
        ...prev,
        [data.requestId]: (prev[data.requestId] || 0) + 1
      }))

      // Invalidar query para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['requestsByProvider', user?.provider?.id] })
    })

    return () => {
      socket.off("request:new")
      socket.off("chat:notification")
    }
  }, [user?.id, user?.provider?.id, queryClient])

  useEffect(() => {
    if (!requestsList) return

    const unreadMessagesMap = requestsList.reduce((acc, request) => {
      if (request?.id && request?.unreadMessages !== undefined) {
        acc[request.id] = request.unreadMessages
      }
      return acc
    }, {} as Record<string, number>)

    setUnreadMessages(prev => {
      const merged = { ...prev }

      Object.keys(unreadMessagesMap).forEach(requestId => {
        const serverCount = unreadMessagesMap[requestId]
        const localCount = merged[requestId] || 0

        // Se o contador local for 0 (mensagens visualizadas), manter 0
        if (localCount === 0) {
          merged[requestId] = 0
        }
        // Se o servidor tiver um valor maior (nova mensagem), usar o valor do servidor
        else if (serverCount > localCount) {
          merged[requestId] = serverCount
        }
        // Caso contrário, manter o valor local
        else {
          merged[requestId] = localCount
        }
      })

      return merged
    })
  }, [requestsList])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

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

              {user?.provider?.is_listed && requestsList?.length === 0 && (
                <CardNotRequests />
              )}
              {user?.provider?.is_listed && (user?.provider?.subscription_situation !== 'active' && user?.provider?.subscription_situation !== 'paid') && requestsList?.length === 0 && (
                <div className="mb-6">

                  <div className="mb-6">
                    <MessageCircleX className="h-16 w-16 mx-auto text-secondary mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    Seu perfil não está aparecendo nas buscas!
                    </h3>
                  </div>

                  <Alert className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30">
                    <AlertDescription className="flex items-center gap-5 md:gap-1 justify-between flex-col md:flex-row">
                      <div className="flex-1 ">
                        <p className="text-md text-muted-foreground">
                          Para aparecer nesta lista e receber mais clientes, você precisa de uma assinatura ativa.
                          <span className="font-medium text-secondary ml-1">Assine agora e aumente sua visibilidade!</span>
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push('/dashboard?tab=subscriptions')}
                        className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Ver Planos
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface - Only show on desktop */}
      <div className={`${!showChat || isMobile ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-auto`}>
        <Card className="flex flex-col h-full border-0 shadow-none md:shadow-md">
          {/*  <CardHeader className="pb-2">
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
          </CardHeader> */}

          <div>
            <ChatHeader
              selectedRequest={selectedRequest}
              onBackToRequests={handleBackToRequests}
              type="chat-client"
              isUserOnline={() => false}
              onSendProposal={() => setShowSendModalProposal(true)}
              onCancelByProvider={() => setShowCancelModal(true)}
            />

            {selectedRequest?.id && (
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <RequestDetailsModal
                  selectedRequest={selectedRequest}
                />
              </div>
            )}
          </div>



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

                    return <MessageComponent message={message} request={selectedRequest} isOwnMessage={isOwnMessage} />
                  })}

                  {/* Indicador de digitação */}
                  {/*     {getTypingUsersInRoom().length > 0 && (
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
                  )} */}
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
                      <Textarea
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
                        rows={1}
                        className="min-h-[1.5rem] max-h-[10rem] overflow-y-auto whitespace-pre-wrap break-all resize-none border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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

      <SendProposalModal
        isOpen={showSendModalProposal}
        onClose={() => setShowSendModalProposal(false)}
        onSendProposal={handleSendProposal}
      />

      <CancelRequestModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
        isLoading={cancelRequestMutation.isPending}
        requestType="provider"
      />
    </div>
  )
}