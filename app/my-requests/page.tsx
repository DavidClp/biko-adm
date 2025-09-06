"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Header } from "@/components/navigation/header"
import { ChatSection } from "./components/chat-section"
import {
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { IRequestService, UserRole } from "@/lib/types"
import { useRequestService } from "@/hooks/use-requests-services"

export const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
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

export default function MyRequestsPage() {
  const { user } = useAuth()
  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)
  const [showChat, setShowChat] = useState(false)
  const searchParams = useSearchParams()
  const providerId = searchParams.get('providerId')

  const { getRequestsByClient } = useRequestService({ clientId: user?.client?.id })

  const { data: requestsList, isLoading: isLoadingRequests, refetch: refetchRequests } = getRequestsByClient;

  const handleSelectRequest = (request: IRequestService) => {
    setSelectedRequest(request)
    setShowChat(true)
  }

  const handleBackToRequests = () => {
    setShowChat(false)
    setSelectedRequest(null)
  }

  // Efeito para abrir automaticamente a última conversa do provider quando providerId estiver presente na URL
  useEffect(() => {
    if (providerId) {
      // Forçar refetch dos dados para garantir que temos a versão mais atualizada
      refetchRequests().then((result) => {
        // Usar os dados retornados do refetch em vez dos dados em cache
        const freshRequestsList = result.data || requestsList
        
        if (freshRequestsList && freshRequestsList.length > 0) {
          // Filtrar requests pelo providerId
          const providerRequests = freshRequestsList.filter(request => request.provider?.id === providerId)
          
          if (providerRequests.length > 0) {
            // Ordenar por data de criação (mais recente primeiro) e pegar o primeiro
            const latestRequest = providerRequests.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0]
            
            // Abrir a conversa automaticamente
            setSelectedRequest(latestRequest)
            setShowChat(true)
          }
        }
      })
    }
  }, [providerId, refetchRequests, requestsList])

  if (isLoadingRequests) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Carregando suas solicitações...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[100vh]">
      <Header />

      {/*   <div className="hidden md:block container mx-auto px-4 py-6">
        <div className="mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Solicitações</h1>
          <p className="text-gray-600">Acompanhe suas solicitações de orçamento e converse com os prestadores</p>
        </div>
      </div> */}

      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-200px)] md:container md:mx-auto md:px-4 md:border md:border-primary/20  rounded-md">
        <div
          className={`${showChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-1/3 bg-white border-r border-gray-200`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Conversas ({requestsList?.length})</h2>
              {/*  <MoreVertical className="w-5 h-5 text-gray-500" /> */}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {requestsList?.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-2xl border-b border-gray-100 cursor-pointer hover:bg-primary/15 transition-colors active:bg-gray-100 ${selectedRequest?.id === request.id ? "bg-primary/15" : ""}`}
                onClick={() => handleSelectRequest(request)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request?.provider?.avatar} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {request?.provider?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/*    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{request?.provider?.name}</h3>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(request?.status)}
                        {request.status === "APPROVED" && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 mt-1">{request?.service_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <ChatSection
          selectedRequest={selectedRequest}
          showChat={showChat}
          onBackToRequests={handleBackToRequests}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  )
}



/*    const mockRequests: ServiceRequest[] = [
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
     ] */
