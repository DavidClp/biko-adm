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
} from "lucide-react"
import { useState } from "react"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"

export function RequestsTab() {
  // Messaging state for internal chat system
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, any[]>>()
  const [newMessage, setNewMessage] = useState("")

  const { user, loading: authLoading } = useAuth()
  const {getRequestsByProvider  } = useRequestService({ providerId: user?.provider?.id })

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

  // Function to handle sending messages in internal chat
  const handleSendMessage = (orderId: string) => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender: "provider",
      senderName: "TESTE",
      message: newMessage,
      timestamp: new Date().toLocaleString("pt-BR"),
      type: "text",
    }

   /*  setMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), message],
    })) */
    setNewMessage("")
  }

    // Function to handle order status changes
    const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
        // Simulate API call to update order status
        console.log(`Order ${orderId} ${action}ed`)
      }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Orders List */}
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Orçamento</CardTitle>
        <CardDescription>Clique em uma solicitação para ver a conversa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requestsList?.map((request) => (
            <Card
              key={request.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedOrder === request?.id ? "ring-2 ring-primary" : ""
                }`}
              onClick={() => setSelectedOrder(request.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{request?.client?.name}</h3>
                    <p className="text-xs text-muted-foreground">{request?.service_type}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request?.status)}
                    <p className="text-xs text-muted-foreground mt-1">{request?.createdAt}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{request?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{request?.value}</span>
                  {messages?.[request?.id] && (
                    <Badge variant="secondary" className="text-xs">
                      {messages?.[request?.id]?.length} mensagens
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Chat Interface */}
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          {selectedOrder
            ? `Conversa com ${requestsList?.find((o) => o.id === selectedOrder)?.client?.name}`
            : "Selecione uma solicitação"}
        </CardTitle>
        {selectedOrder && (
          <CardDescription>
            {requestsList?.find((o) => o.id === selectedOrder)?.service_type}
          </CardDescription>
        )}
      </CardHeader>

      {selectedOrder ? (
        <>
          <CardContent className="flex-1 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages?.[selectedOrder]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "provider" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === "provider" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "provider" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="p-4 border-t">
            {requestsList?.find((o) => o.id === selectedOrder)?.status === "PENDING" && (
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

            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(selectedOrder)}
              />
              <Button onClick={() => handleSendMessage(selectedOrder)}>
                <MessageSquare className="h-4 w-4" />
              </Button>
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
  )
}