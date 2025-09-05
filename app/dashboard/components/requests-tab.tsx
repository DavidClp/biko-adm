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
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"
import { useIsMobile } from "@/hooks/use-mobile"
import { IRequestService, Message } from "@/lib/types"
import { socket } from "@/lib/socket"
import { RequestDetailsModal } from "@/app/my-requests/components/request-details-modal"
import { formatCurrency, formatDate, formatDateWithTime } from "@/lib/utils"

export function RequestsTab() {
  // Messaging state for internal chat system
  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)
  const [showChat, setShowChat] = useState(false)
  // const [messages, setMessages] = useState<Record<string, any[]>>()

  const router = useRouter()
  const isMobile = useIsMobile()
  const { user, loading: authLoading } = useAuth()
  const { getRequestsByProvider } = useRequestService({ providerId: user?.provider?.id })

  const { data: requestsList, isLoading: isLoadingRequests, isError: isErrorRequests, error: errorRequests } = getRequestsByProvider;


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

  const [newMessage, setNewMessage] = useState("")

  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesContainerRef])

  const send = useCallback(() => {
    const content = inputRef.current!.value.trim()
    if (!content) return;

    socket.emit("chat:send", { requestId: selectedRequest?.id, toUserId: selectedRequest?.provider?.userId, content })

    inputRef.current!.value = ""
    setNewMessage("")
  }, [selectedRequest?.id, user?.id])

  useEffect(() => {
    socket.auth = { userId: user?.id }
    socket.connect()

    socket.emit("chat:join", { requestId: selectedRequest?.id })

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
    });

    return () => {
      socket.off("chat:new_message")
      socket.off("chat:load_messages")
      socket.off("chat:message_viewed")
      socket.disconnect()
      setMessages([])
    }
  }, [selectedRequest?.id, user?.id])

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-200px)] lg:h-auto lg:grid lg:grid-cols-2 lg:gap-6">
      {/* Orders List */}
      <div className={`${showChat && !isMobile ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-auto`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Solicitações de Orçamento</CardTitle>
            <CardDescription>Clique em uma solicitação para ver a conversa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requestsList?.map((request) => (
                <Card
                  key={request.id}
                  className={`cursor-pointer transition-colors shadow-md hover:bg-muted/50 ${selectedRequest?.id === request?.id ? "ring-2 ring-primary border-none" : ""}`}
                  onClick={() => handleSelectRequest(request)}
                >
                <CardContent>
                  <div className="flex flex-col items-start justify-between mb-2 gap-2">
                    <div className="flex justify-between w-full items-center">
                      <h3 className="font-semibold text-sm">{request?.client?.name}</h3>
                      {getStatusBadge(request?.status)}
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
            ))}
          </div>
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
                {messages?.map((message) => {
                  const isProviderMessage = message.sender_id === selectedRequest?.provider?.userId;

                  return (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${isProviderMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${isProviderMessage
                          ? "bg-primary font-medium rounded-br-md"
                          : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${isProviderMessage ? "text-accent-foreground" : "text-accent-foreground"
                            }`}
                        >
                          <span className="text-xs">
                            {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message?.viewed && isProviderMessage && <CheckCircle className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
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