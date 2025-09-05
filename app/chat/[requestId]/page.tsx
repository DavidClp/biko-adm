"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"
import { IRequestService, Message } from "@/lib/types"
import { socket } from "@/lib/socket"
import { RequestDetailsModal } from "@/app/my-requests/components/request-details-modal"
import { formatCurrency, formatDateWithTime } from "@/lib/utils"
import { Header } from "@/components/navigation/header"
import { ChatHeader } from "@/app/my-requests/components/chat-header"
import { getStatusBadge } from "@/app/my-requests/page"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.requestId as string

  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { user, loading: authLoading } = useAuth()
  const { getRequestsByProvider } = useRequestService({ providerId: user?.provider?.id })
  const { data: requestsList } = getRequestsByProvider

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const send = () => {
    const content = inputRef.current!.value.trim()
    if (!content) return

    socket.emit("chat:send", {
      requestId: selectedRequest?.id,
      toUserId: selectedRequest?.provider?.userId,
      content
    })

    inputRef.current!.value = ""
    setNewMessage("")
  }

  useEffect(() => {
    if (requestsList && requestId) {
      const request = requestsList.find(r => r.id === requestId)
      if (request) {
        setSelectedRequest(request)
      } else {
        // Se não encontrar a solicitação, redirecionar de volta
        router.push('/dashboard')
      }
    }
  }, [requestsList, requestId, router])

  useEffect(() => {
    if (!user?.id || !selectedRequest?.id) return

    socket.auth = { userId: user.id }
    socket.connect()

    socket.emit("chat:join", { requestId: selectedRequest.id })

    socket.on("chat:new_message", (msg: Message) => {
      if (msg.request_id === selectedRequest.id) {
        setMessages((prev) => [...prev, msg])
      }
    })

    socket.on('chat:load_messages', (data) => {
      setMessages(data?.messages || [])
    })

    socket.on('chat:message_viewed', (message) => {
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === message.id ? { ...msg, viewed: true } : msg
        )
      )
    })

    return () => {
      socket.disconnect()
      setMessages([])
    }
  }, [selectedRequest?.id, user?.id])

  const processedMessagesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage &&
      lastMessage.sender_id !== user?.id &&
      !lastMessage.viewed) {

      const timeoutId = setTimeout(() => {
        socket.emit('chat:viewed', {
          messageId: lastMessage.id,
        })
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, user?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!selectedRequest) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Solicitação não encontrada</p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-4"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

        <ChatHeader
          selectedRequest={selectedRequest}
          onBackToRequests={() => router.push('/dashboard')}
          getStatusBadge={getStatusBadge}
          type="chat-client"
        />
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <RequestDetailsModal
            selectedRequest={selectedRequest}
            getStatusBadge={getStatusBadge}
          />
        </div>

      {/* Messages */}
      <CardContent
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23f0f0f0" fillOpacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        <div className="space-y-4">
          {messages?.map((message) => {
            const isProviderMessage = message.sender_id === selectedRequest?.provider?.userId

            return (
              <div
                key={message.id}
                className={`mb-3 flex ${isProviderMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${isProviderMessage
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
            )
          })}
        </div>
      </CardContent>

      {/* Input */}
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
  )
}
