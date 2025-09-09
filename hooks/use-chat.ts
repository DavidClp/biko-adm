import { useCallback, useEffect, useRef, useState } from "react"
import { Message } from "@/lib/types"
import { socket } from "@/lib/socket"

interface UseChatProps {
  selectedRequestId?: string
  userId?: string
  onNewMessage?: (msg: Message) => void
}

export function useChat({ selectedRequestId, userId, onNewMessage }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  const send = useCallback(() => {
    const content = inputRef.current!.value.trim()
    if (!content || !selectedRequestId) return

    socket.emit("chat:send", { 
      requestId: selectedRequestId, 
      content 
    })

    inputRef.current!.value = ""
    setNewMessage("")
  }, [selectedRequestId])

  // Effect para conectar ao socket e gerenciar mensagens
  useEffect(() => {
    if (!userId || !selectedRequestId) return

    socket.auth = { userId }
    socket.connect()

    socket.emit("chat:join", { requestId: selectedRequestId })

    socket.on("chat:new_message", (msg: Message) => {
      if (msg.request_id === selectedRequestId) {
        setMessages((prev) => [...prev, msg])
      } else {
        // Notificar componente pai sobre mensagem de outra conversa
        onNewMessage?.(msg)
      }
    })

    socket.on('chat:load_messages', (data) => {
      setMessages(data?.messages || [])
    })

    socket.on('chat:message_viewed', (message) => {
      setMessages((prev) => 
        prev.map(msg => msg.id === message.id ? { ...msg, viewed: true } : msg)
      )
    })

    return () => {
      socket.off("chat:new_message")
      socket.off("chat:load_messages")
      socket.off("chat:message_viewed")
      socket.disconnect()
      setMessages([])
    }
  }, [selectedRequestId, userId, onNewMessage])

  // Effect para marcar mensagem como visualizada
  useEffect(() => {
    if (!messages.length) return

    const lastMessage = messages[messages.length - 1]

    if (lastMessage &&
      lastMessage.sender_id !== userId &&
      !lastMessage.viewed) {

      const timeoutId = setTimeout(() => {
        socket.emit('chat:viewed', {
          receiverId: lastMessage.receiver_id,
          requestId: lastMessage.request_id,
        })
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [selectedRequestId, messages, userId])

  // Effect para scroll automático
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return {
    messages,
    newMessage,
    setNewMessage,
    inputRef,
    messagesContainerRef,
    send,
    scrollToBottom
  }
}
