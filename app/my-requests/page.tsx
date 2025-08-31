"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Header } from "@/components/navigation/header"
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  MapPin,
  DollarSign,
  ArrowLeft,
  MoreVertical,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { UserRole } from "@/lib/types"

interface ServiceRequest {
  id: string
  providerId: string
  providerName: string
  providerAvatar: string
  serviceType: string
  description: string
  urgency: string
  budget: string
  location: string
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
  messages: Message[]
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: "client" | "provider"
  content: string
  timestamp: string
}

export default function MyRequestsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!user || user.role !== UserRole.CLIENT) {
      router.push("/login")
      return
    }

    setTimeout(() => {
      const mockRequests: ServiceRequest[] = [
        {
          id: "1",
          providerId: "1",
          providerName: "João Silva",
          providerAvatar: "/professional-electrician.png",
          serviceType: "Elétrica",
          description: "Preciso instalar tomadas na cozinha e trocar o quadro elétrico",
          urgency: "medium",
          budget: "R$ 500 - R$ 800",
          location: "São Paulo, SP",
          status: "accepted",
          createdAt: "2024-01-15T10:00:00Z",
          messages: [
            {
              id: "1",
              senderId: user?.id || "",
              senderName: user?.name || "",
              senderType: "client",
              content: "Olá! Gostaria de um orçamento para instalação de tomadas na cozinha.",
              timestamp: "2024-01-15T10:00:00Z",
            },
            {
              id: "2",
              senderId: "1",
              senderName: "João Silva",
              senderType: "provider",
              content: "Olá! Posso ajudar sim. Quando seria melhor para fazer uma visita técnica?",
              timestamp: "2024-01-15T10:30:00Z",
            },
          ],
        },
        {
          id: "2",
          providerId: "2",
          providerName: "Maria Santos",
          providerAvatar: "/professional-designer-woman.png",
          serviceType: "Design de Interiores",
          description: "Quero reformar a sala de estar com um estilo moderno",
          urgency: "low",
          budget: "R$ 2000 - R$ 3000",
          location: "Rio de Janeiro, RJ",
          status: "pending",
          createdAt: "2024-01-14T14:00:00Z",
          messages: [
            {
              id: "3",
              senderId: user?.id || "",
              senderName: user?.name || "",
              senderType: "client",
              content: "Gostaria de um projeto de design para minha sala de estar.",
              timestamp: "2024-01-14T14:00:00Z",
            },
          ],
        },
      ]
      setRequests(mockRequests)
      setLoading(false)
    }, 1000)
  }, [user, router, authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aceito
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRequest) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      senderName: user?.name || "",
      senderType: "client",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setSelectedRequest((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
          }
        : null,
    )

    setRequests((prev) =>
      prev.map((req) => (req.id === selectedRequest.id ? { ...req, messages: [...req.messages, message] } : req)),
    )

    setNewMessage("")
  }

  const handleSelectRequest = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setShowChat(true)
  }

  const handleBackToRequests = () => {
    setShowChat(false)
    setSelectedRequest(null)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? "Verificando autenticação..." : "Carregando suas solicitações..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="md:hidden bg-green-600 text-white p-4 sticky top-16 z-10">
        <h1 className="text-lg font-semibold">
          {showChat && selectedRequest ? selectedRequest.providerName : "Minhas Conversas"}
        </h1>
      </div>

      <div className="hidden md:block container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Solicitações</h1>
          <p className="text-gray-600">Acompanhe suas solicitações de orçamento e converse com os prestadores</p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-200px)] md:container md:mx-auto md:px-4">
        <div
          className={`${showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-1/3 bg-white border-r border-gray-200`}
        >
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Conversas ({requests.length})</h2>
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                  selectedRequest?.id === request.id ? "bg-green-50" : ""
                }`}
                onClick={() => handleSelectRequest(request)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.providerAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {request.providerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{request.providerName}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {request.messages.length > 0
                          ? request.messages[request.messages.length - 1].content
                          : request.description}
                      </p>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(request.status)}
                        {request.status === "accepted" && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{request.serviceType}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className={`${!showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-2/3 bg-white`}>
          {selectedRequest ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
                <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={handleBackToRequests}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedRequest.providerAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {selectedRequest.providerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedRequest.providerName}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.serviceType}</p>
                </div>
                {getStatusBadge(selectedRequest.status)}
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </div>

              <div className="p-3 bg-yellow-50 border-b border-yellow-200 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-800">Detalhes da Solicitação</span>
                </div>
                <p className="text-yellow-700 mb-2">{selectedRequest.description}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {selectedRequest.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedRequest.location}
                  </span>
                </div>
              </div>

              <div
                className="flex-1 bg-gray-100 bg-opacity-50"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23f0f0f0" fillOpacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
              >
                <ScrollArea className="h-full p-4">
                  {selectedRequest.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${message.senderType === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${
                          message.senderType === "client"
                            ? "bg-green-500 text-white rounded-br-md"
                            : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            message.senderType === "client" ? "text-green-100" : "text-gray-500"
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

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                    <Input
                      placeholder="Digite uma mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 p-0"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Bem-vindo ao Listão</h3>
                <p>Selecione uma conversa para começar a conversar com um prestador</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
