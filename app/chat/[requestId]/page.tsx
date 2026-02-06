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
  Image,
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
import { CancelRequestModal } from "@/components/cancel-request-modal"
import { ImagePicker } from "@/components/image-picker"
import { useImageUpload } from "@/hooks/use-image-upload"

export default function ChatPage() {
  const router = useRouter()
  
  const params = useParams()

  const requestId = params.requestId as string

  const [selectedRequest, setSelectedRequest] = useState<IRequestService | null>(null)

  const { user, loading: authLoading } = useAuth()
  const { getRequestsByProvider } = useRequestService({ providerId: user?.provider?.id })
  const { data: requestsList } = getRequestsByProvider

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSendModalProposal, setShowSendModalProposal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    messages,
    newMessage,
    setNewMessage,
    inputRef,
    messagesContainerRef,
    send,
    sendMessageProposal,
    sendImageMessage,
  } = useChat({
    selectedRequestId: selectedRequest?.id,
    userId: user?.id,
    userName: user?.name,
    toUserId: selectedRequest?.client?.userId,
    providerId: selectedRequest?.provider?.id,
    onRequestStatusUpdate: (data) => {
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: data.status as any,
        budgetStatus: data.budgetStatus as any
      } : null)
    }
  })

  const { sendBudgetRequestMutation, cancelRequestMutation } = useRequestService({ providerId: selectedRequest?.provider?.id });
  const uploadImageMutation = useImageUpload();

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
      providerId: selectedRequest.provider?.userId,
      clientId: selectedRequest.client?.userId,
      cancelledBy: 'provider',
      userName: user?.name
    }, {
      onSuccess: () => {
        setShowCancelModal(false);
        router.push('/dashboard');
      }
    });
  }, [selectedRequest?.id, cancelRequestMutation, router, user?.name]);

  const handleImageSelect = useCallback(async (file: File) => {
    if (!selectedRequest?.id) return;

    uploadImageMutation.mutate({
      file,
      requestId: selectedRequest.id
    }, {
      onSuccess: (data) => {
        // Enviar mensagem com a URL da imagem
        sendImageMessage(data.imageUrl);
      }
    });
  }, [selectedRequest?.id, uploadImageMutation, sendImageMessage]);

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
    <div className="max-h-[calc(100vh-48px)] flex flex-col bg-white">
      <Header />

      <ChatHeader
        selectedRequest={selectedRequest}
        onBackToRequests={() => router.push('/dashboard')}
        type="chat-client"
        isUserOnline={() => false}
        onSendProposal={() => setShowSendModalProposal(true)}
        onCancelByProvider={() => setShowCancelModal(true)}
      />
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
        <RequestDetailsModal
          selectedRequest={selectedRequest}
        />
      </div>

      <CardContent
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
      
      >
        <div className="space-y-4">
          {messages?.map((message) => {
            const isOwnMessage = message.sender_id === selectedRequest?.provider?.userId

            return <MessageComponent message={message} request={selectedRequest} isOwnMessage={isOwnMessage} key={message.id}/>
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
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setShowImagePicker(true)}
            >
              <Image className="w-4 h-4" />
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

      <CancelRequestModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
        isLoading={cancelRequestMutation.isPending}
        requestType="provider"
      />

      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  )
}
