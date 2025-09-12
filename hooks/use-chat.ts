import { useCallback, useEffect, useRef, useState } from "react"
import { Message } from "@/lib/types"
import { socket } from "@/lib/socket"

interface UseChatProps {
  selectedRequestId?: string
  userId?: string
  userName?: string
  toUserId?: string
  providerId?: string
  onNewMessage?: (msg: Message) => void
  onUserOnline?: (userId: string, userName: string) => void
  onUserOffline?: (userId: string) => void
  onRequestStatusUpdate?: (data: { requestId: string, status: string, budgetStatus: string }) => void
}

interface OnlineUser {
  userId: string
  userName: string
  isOnline: boolean
  lastSeen: Date
  currentRoom?: string
}

interface TypingUser {
  userId: string
  userName: string
  requestId: string
}

export function useChat({
  selectedRequestId,
  userId,
  userName,
  toUserId,
  providerId,
  onNewMessage,
  onUserOnline,
  onUserOffline,
  onRequestStatusUpdate
}: UseChatProps) {
  // Estados principais
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastMessageIdRef = useRef<string | undefined>(undefined)
  const isConnectedRef = useRef(false)
  const currentRequestIdRef = useRef<string | undefined>(undefined)
  const markAsViewedTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastMarkedMessagesRef = useRef<Set<string>>(new Set())

  // Scroll para o final
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }, [])

  // Scroll para o topo (para carregar mais mensagens)
  const scrollToTop = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0
    }
  }, [])

  // Enviar mensagem
  const send = useCallback(() => {
    const content = inputRef.current?.value.trim()
    if (!content || !selectedRequestId || !userId || !toUserId || !providerId) return

    socket.emit("chat:send", {
      requestId: selectedRequestId,
      content,
      type: "TEXT",
      toUserId,
      providerId
    })

    inputRef.current!.value = ""
    setNewMessage("")
    setIsTyping(false)
  }, [selectedRequestId, userId, toUserId, providerId])

  const sendMessageProposal = useCallback(({ budget, observation }: { budget: number, observation: string }) => {
    if (!selectedRequestId || !userId || !toUserId || !providerId) return;

    socket.emit("chat:send", {
      requestId: selectedRequestId,
      content: JSON.stringify({ budget, observation }),
      type: "PROPOSAL",
      toUserId,
      providerId
    })
  }, [selectedRequestId, userId, toUserId, providerId])

  const updateProposalStatus = useCallback((messageId: string, newType: "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "PROPOSAL_CANCELLED") => {
    if (!selectedRequestId) return;

    socket.emit("chat:proposal_status_update", {
      messageId,
      requestId: selectedRequestId,
      newType
    })
  }, [selectedRequestId])

  const updateRequestStatus = useCallback((status: string, budgetStatus: string) => {
    if (!selectedRequestId) return;

    socket.emit("chat:request_status_update", {
      requestId: selectedRequestId,
      status,
      budgetStatus
    })
  }, [selectedRequestId])

  const loadMoreMessages = useCallback(() => {
    if (!selectedRequestId || !hasMoreMessages || isLoading) return

    setIsLoading(true)
    socket.emit("chat:load_more", {
      requestId: selectedRequestId,
      lastMessageId: lastMessageIdRef.current
    })
  }, [selectedRequestId, hasMoreMessages, isLoading])

  // Indicador de digitação
  const handleTyping = useCallback(() => {
    if (!selectedRequestId || !userName) return

    setIsTyping(true)
    socket.emit("chat:typing_start", {
      requestId: selectedRequestId,
      userName
    })

    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Parar indicador após 3 segundos de inatividade
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("chat:typing_stop", {
        requestId: selectedRequestId
      })
    }, 3000)
  }, [selectedRequestId, userName])

  // Parar indicador de digitação
  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setIsTyping(false)
    socket.emit("chat:typing_stop", {
      requestId: selectedRequestId
    })
  }, [selectedRequestId])

  // Marcar mensagens como visualizadas
  const markAsViewed = useCallback((messageIds: string[]) => {
    if (!messageIds.length || !selectedRequestId) return

    // Verificar se já marcamos essas mensagens recentemente
    const alreadyMarked = messageIds.every(id => lastMarkedMessagesRef.current.has(id))
    if (alreadyMarked) {
      return
    }

    // Adicionar ao conjunto de mensagens marcadas
    messageIds.forEach(id => lastMarkedMessagesRef.current.add(id))

    socket.emit("chat:viewed", {
      messageIds,
      requestId: selectedRequestId
    })

    // Limpar o conjunto após 5 segundos para permitir nova marcação se necessário
    setTimeout(() => {
      messageIds.forEach(id => lastMarkedMessagesRef.current.delete(id))
    }, 5000)
  }, [selectedRequestId])

  // Não conectar aqui - o use-auth gerencia a conexão principal
  // Apenas verificar se está conectado
  useEffect(() => {
    if (userId && socket.connected) {
      isConnectedRef.current = true
    }
  }, [userId])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isConnectedRef.current = false
    }
  }, [])

  // Gerenciar mudança de sala
  useEffect(() => {
    if (!userId) return

    // Se não há sala selecionada, apenas sair da sala atual
    if (!selectedRequestId) {
      if (currentRequestIdRef.current) {
        socket.emit("chat:leave", { requestId: currentRequestIdRef.current })
        currentRequestIdRef.current = undefined
      }
      return
    }

    // Se já está na mesma sala, não fazer nada
    if (currentRequestIdRef.current === selectedRequestId) return

    // Sair da sala anterior se existir
    if (currentRequestIdRef.current) {
      socket.emit("chat:leave", { requestId: currentRequestIdRef.current })
    }

    // Entrar na nova sala
    socket.emit("chat:join", { requestId: selectedRequestId })
    currentRequestIdRef.current = selectedRequestId

    // Limpar estados da sala anterior
    setMessages([])
    setTypingUsers([])
    setUnreadCount(0)

  }, [selectedRequestId, userId])

  // Event listeners (apenas uma vez)
  useEffect(() => {
    if (!userId) return

    const handleNewMessage = (msg: Message) => {
      if (msg.request_id === selectedRequestId) {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === msg.id)
          if (exists) {
            return prev
          }

          let newPrev = prev;

          // temos que marcas as propostas antigas com reject
          if (msg.type === "PROPOSAL") {
            newPrev = prev?.map((m) => ({
              ...m, budgetStatus: "REJECTED"
            }))
          }

          return [...newPrev, msg]
        })

        lastMessageIdRef.current = msg.id

        if (msg.sender_id === userId) {
          setUnreadCount(0)
        } else {
          setUnreadCount(prev => prev + 1)
        }
      } else {
        // Notificar componente pai sobre mensagem de outra conversa
        onNewMessage?.(msg)
      }
    }

    const handleLoadMessages = (data: { messages: Message[], hasMore: boolean }) => {
      setMessages(data.messages || [])
      setHasMoreMessages(data.hasMore || false)
      if (data.messages?.length) {
        lastMessageIdRef.current = data.messages[data.messages.length - 1].id
      }
    }

    const handleMoreMessages = (data: { messages: Message[], hasMore: boolean }) => {
      setMessages(prev => [...data.messages, ...prev])
      setHasMoreMessages(data.hasMore || false)
      setIsLoading(false)
      if (data.messages?.length) {
        lastMessageIdRef.current = data.messages[data.messages.length - 1].id
      }
    }

    const handleMessagesViewed = (data: { messageIds: string[], requestId: string }) => {
      if (data.requestId === selectedRequestId) {
        setMessages(prev =>
          prev.map(msg =>
            data.messageIds.includes(msg.id)
              ? { ...msg, viewed: true }
              : msg
          )
        )
      }
    }

    const handleUserOnline = (data: { userId: string, userName: string, isOnline: boolean }) => {
      console.log("👤 Usuário online:", data.userId, data.userName)
      setOnlineUsers(prev => {
        const existing = prev.find(u => u.userId === data.userId)
        if (existing) {
          return prev.map(u => u.userId === data.userId ? { ...u, ...data, lastSeen: new Date() } : u)
        }
        return [...prev, { ...data, lastSeen: new Date() }]
      })
      onUserOnline?.(data.userId, data.userName)
    }

    const handleUserOffline = (data: { userId: string, isOnline: boolean }) => {
      console.log("👤 Usuário offline:", data.userId)
      setOnlineUsers(prev => {
        const existing = prev.find(u => u.userId === data.userId)
        if (existing) {
          return prev.map(u => u.userId === data.userId ? { ...u, isOnline: false, lastSeen: new Date() } : u)
        }
        return prev
      })
      onUserOffline?.(data.userId)
    }

    const handleTypingStart = (data: { userId: string, userName: string, requestId: string }) => {
      if (data.requestId === selectedRequestId && data.userId !== userId) {
        setTypingUsers(prev => {
          const existing = prev.find(u => u.userId === data.userId)
          if (!existing) {
            return [...prev, data]
          }
          return prev
        })
      }
    }

    const handleTypingStop = (data: { userId: string, requestId: string }) => {
      if (data.requestId === selectedRequestId) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
      }
    }

    const handleNotification = (data: { message: Message, requestId: string, senderId: string }) => {
      // Se não estamos na sala da notificação, incrementar contador
      if (data.requestId !== selectedRequestId) {
        setUnreadCount(prev => prev + 1)
        // Notificar componente pai sobre nova mensagem
        onNewMessage?.(data.message)
      }
    }

    const handleProposalStatusUpdate = (data: { 
      messageId: string, 
      requestId: string, 
      newType: "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "PROPOSAL_CANCELLED" 
    }) => {
      
      if (data.requestId === selectedRequestId) {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, type: data.newType } : msg
        ))
      } else {
      }
    }

    const handleRequestStatusUpdate = (data: { 
      requestId: string, 
      status: string, 
      budgetStatus: string 
    }) => {
      console.log("📊 Recebendo atualização de status de request:", {
        requestId: data.requestId,
        status: data.status,
        budgetStatus: data.budgetStatus,
        currentRequestId: selectedRequestId
      })
      
      if (data.requestId === selectedRequestId) {
        console.log("✅ Atualizando status de request localmente")
        
        // Notificar componente pai sobre mudança de status
        onRequestStatusUpdate?.(data)
        
        // Notificar componente pai sobre mudança de status como mensagem
        onNewMessage?.({
          id: `status-${Date.now()}`,
          content: `Status atualizado: ${data.status} - ${data.budgetStatus}`,
          sender_id: userId || '',
          receiver_id: '',
          request_id: data.requestId,
          type: 'TEXT',
          viewed: false,
          createdAt: new Date().toISOString()
        } as Message)
        
        // Forçar atualização da interface
        window.dispatchEvent(new CustomEvent('requestStatusUpdated', {
          detail: { requestId: data.requestId, status: data.status, budgetStatus: data.budgetStatus }
        }))
      }
    }

    const handleError = (error: { message: string }) => {
      console.error("Erro no chat:", error.message)
    }

    // Registrar listeners
    socket.on("chat:new_message", handleNewMessage)
    socket.on("chat:notification", handleNotification)
    socket.on("chat:load_messages", handleLoadMessages)
    socket.on("chat:more_messages", handleMoreMessages)
    socket.on("chat:messages_viewed", handleMessagesViewed)
    socket.on("user:online", handleUserOnline)
    socket.on("user:offline", handleUserOffline)
    socket.on("chat:typing_start", handleTypingStart)
    socket.on("chat:typing_stop", handleTypingStop)
    socket.on("chat:proposal_status_update", handleProposalStatusUpdate)
    socket.on("chat:request_status_update", handleRequestStatusUpdate)
    socket.on("chat:error", handleError)

    return () => {
      // Limpar listeners
      socket.off("chat:new_message", handleNewMessage)
      socket.off("chat:notification", handleNotification)
      socket.off("chat:load_messages", handleLoadMessages)
      socket.off("chat:more_messages", handleMoreMessages)
      socket.off("chat:messages_viewed", handleMessagesViewed)
      socket.off("user:online", handleUserOnline)
      socket.off("user:offline", handleUserOffline)
      socket.off("chat:typing_start", handleTypingStart)
      socket.off("chat:typing_stop", handleTypingStop)
      socket.off("chat:proposal_status_update", handleProposalStatusUpdate)
      socket.off("chat:request_status_update", handleRequestStatusUpdate)
      socket.off("chat:error", handleError)
    }
  }, [userId, selectedRequestId, onNewMessage, onUserOnline, onUserOffline])

  // Effect para marcar mensagens como visualizadas quando o usuário está no chat
  useEffect(() => {
    if (!messages.length || !userId || !selectedRequestId) return

    // Limpar timeout anterior
    if (markAsViewedTimeoutRef.current) {
      clearTimeout(markAsViewedTimeoutRef.current)
    }

    // Marcar todas as mensagens não lidas como visualizadas com debounce
    const unreadMessages = messages.filter(
      msg => msg.sender_id !== userId && !msg.viewed
    )

    if (unreadMessages.length > 0) {
      markAsViewedTimeoutRef.current = setTimeout(() => {
        markAsViewed(unreadMessages.map(msg => msg.id))
      }, 3000) // Aumentado para 3 segundos para evitar loops
    }
  }, [messages.length, userId, selectedRequestId, markAsViewed]) // Removido 'messages' das dependências

  // Effect para marcar mensagens como visualizadas quando o usuário entra na sala
  useEffect(() => {
    if (!selectedRequestId || !userId) return

    // Pequeno delay para garantir que as mensagens foram carregadas
    const timeoutId = setTimeout(() => {
      const unreadMessages = messages.filter(
        msg => msg.sender_id !== userId && !msg.viewed
      )

      if (unreadMessages.length > 0) {
        markAsViewed(unreadMessages.map(msg => msg.id))
      }
    }, 2000) // Aumentado para 2 segundos

    return () => clearTimeout(timeoutId)
  }, [selectedRequestId, userId, markAsViewed]) // Removido 'messages.length' das dependências

  // Effect para scroll automático
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Effect para limpar indicador de digitação ao enviar mensagem
  useEffect(() => {
    if (isTyping) {
      stopTyping()
    }
  }, [newMessage, isTyping, stopTyping])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (markAsViewedTimeoutRef.current) {
        clearTimeout(markAsViewedTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Estados
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    hasMoreMessages,
    onlineUsers,
    typingUsers,
    isTyping,
    setMessages,
    unreadCount,

    // Refs
    inputRef,
    messagesContainerRef,

    // Funções
    send,
    loadMoreMessages,
    handleTyping,
    stopTyping,
    markAsViewed,
    scrollToBottom,
    scrollToTop,
    sendMessageProposal,
    updateProposalStatus,
    updateRequestStatus,

    // Utilitários
    isUserOnline: (userId: string) => onlineUsers.some(u => u.userId === userId && u.isOnline),
    getTypingUsersInRoom: () => typingUsers,
    getUnreadCount: () => unreadCount
  }
}
