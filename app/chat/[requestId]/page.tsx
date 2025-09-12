"use client"

import { useCallback, useEffect, useState } from "react"
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
  Smile,
} from "lucide-react"
import { useRequestService } from "@/hooks/use-requests-services"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { IRequestService, Message } from "@/lib/types"
import { RequestDetailsModal } from "@/app/my-requests/components/request-details-modal"
import { Header } from "@/components/navigation/header"
import { ChatHeader } from "@/app/my-requests/components/chat-header"
import { EmojiPicker } from "@/components/emoji-picker"
import { Textarea } from "@/components/ui/textarea"
import { MessageComponent } from "@/app/my-requests/components/message-component"
import { SendProposalModal } from "@/components/send-proposal-modal"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.requestId as string

  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)

  const { user, loading: authLoading } = useAuth()
  const { getRequestsByProvider } = useRequestService({ providerId: user?.provider?.id })
  const { data: requestsList } = getRequestsByProvider

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSendModalProposal, setShowSendModalProposal] = useState(false);

  const {
    messages,
    newMessage,
    setNewMessage,
    inputRef,
    messagesContainerRef,
    send,
    sendMessageProposal,
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.client?.userId,
    providerId: selectedRequest?.provider?.id,
  })

  const { sendBudgetRequestMutation } = useRequestService({ providerId: selectedRequest?.provider?.id });

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
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

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
        type="chat-client"
        isUserOnline={() => false}
        onSendProposal={() => setShowSendModalProposal(true)}
      />
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 ">
        <RequestDetailsModal
          selectedRequest={selectedRequest}
        />
      </div>

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
            const isOwnMessage = message.sender_id === selectedRequest?.provider?.userId

            return <MessageComponent message={message} request={selectedRequest} isOwnMessage={isOwnMessage} />
          })}
        </div>
      </CardContent>

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
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && send()}
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

      <SendProposalModal
        isOpen={showSendModalProposal}
        onClose={() => setShowSendModalProposal(false)}
        onSendProposal={handleSendProposal}
      />
    </div>
  )
}
