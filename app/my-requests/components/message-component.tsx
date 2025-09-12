import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { useRequestService } from "@/hooks/use-requests-services";
import { IRequestService, Message } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export function MessageComponent({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    switch (message.type) {
        case "TEXT":
            return <MessageText message={message} isOwnMessage={isOwnMessage} />
        case "PROPOSAL":
            return <MessageProposal message={message} isOwnMessage={isOwnMessage} request={request} />
        case "PROPOSAL_REJECTED":
            return <MessageProposalRejected message={message} isOwnMessage={isOwnMessage} request={request} />
        case "PROPOSAL_ACCEPTED":
            return <MessageProposalAccepted message={message} isOwnMessage={isOwnMessage} request={request} />
        case "PROPOSAL_CANCELLED":
            return <MessageProposalCancelled message={message} isOwnMessage={isOwnMessage} request={request} />
        default:
            return null
    }
}

function MessageText({ message, isOwnMessage }: { message: Message, isOwnMessage: boolean }) {
    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-xl shadow-sm break-words  ${isOwnMessage
                    ? "bg-primary font-medium rounded-br-md"
                    : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
            >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div
                    className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"
                        }`}
                >
                    <span className="text-xs">
                        {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {message?.viewed && isOwnMessage && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                </div>
            </div>
        </div>
    )
}

function MessageProposal({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    const { user } = useAuth()

    const isProvider = user?.id === message?.sender_id;

    const { budget, observation } = JSON.parse(message?.content || '{}');

    const { editRequestMutation } = useRequestService();

    const {
        setMessages
      } = useChat({
        selectedRequestId: request?.id,
        userId: user?.id,
        userName: user?.name,
        toUserId: request?.client?.userId,
        providerId: request?.provider?.id,
      })

    const handleAccept = () => {
        editRequestMutation.mutate({ id: request?.id, status: "ACCEPTED", budgetStatus: "ACCEPTED" })
        setMessages(prev => prev?.map(m => ({ ...m, type: "PROPOSAL_ACCEPTED" })))
    }

    const handleRejectByClient = () => {
        editRequestMutation.mutate({ id: request?.id, budgetStatus: "REJECTED", status: "PENDING" });
        setMessages(prev => prev?.map(m => ({ ...m, type: "PROPOSAL_REJECTED" })))
    }
    
    const handleCancelByProvider = () => {
        editRequestMutation.mutate({ id: request?.id, status: "PENDING", budgetStatus: "CANCELLED" })
        setMessages(prev => prev?.map(m => ({ ...m, type: "PROPOSAL_CANCELLED" })))
    }

    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-md shadow-sm break-words  ${isOwnMessage
                    ? "bg-primary font-medium rounded-br-md"
                    : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
            >
                <p className="text-md leading-4">
                    {isProvider ? "Você enviou uma orçamento de" : request?.provider?.name.split(" ")?.[0] + " enviou um orçamento de "}: <span className="font-bold text-xl">{formatCurrency(Number(budget))}</span>
                </p>

                <p className="text-sm leading-relaxed">{observation}</p>

                <Separator className="my-1" />

                {!isProvider && (
                    <div className="flex gap-2 justify-between">
                        <Button variant="secondary" className="w-28" size="sm" onClick={handleAccept}>
                            Aceitar
                        </Button>

                        <Button variant="destructive" className="w-28" size="sm" onClick={handleRejectByClient}>
                            Rejeitar
                        </Button>

                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`} >
                            <span className="text-xs">
                                {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {message?.viewed && isOwnMessage && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    </div>
                )}

                {isProvider && (
                    <div className="flex items-center justify-between gap-1 mt-1">
                        <Button variant="destructive" size="sm" onClick={handleCancelByProvider}>
                            Cancelar orçamento
                        </Button>

                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`} >
                            <span className="text-xs">
                                {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {message?.viewed && isOwnMessage && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function MessageProposalRejected({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    const { user } = useAuth()
    const isProvider = user?.id === message?.sender_id;

    const { budget, observation } = JSON.parse(message?.content || '{}');

    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-md shadow-sm break-words  ${isOwnMessage
                    ? "bg-primary font-medium rounded-br-md"
                    : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
            >
                <p className="text-md leading-4">
                    {isProvider ? "Você enviou uma orçamento de" : request?.provider?.name.split(" ")?.[0] + " enviou um orçamento de "}: <span className="font-bold text-xl">{formatCurrency(Number(budget))}</span>
                </p>

                <p className="text-sm leading-relaxed">{observation}</p>

                <Separator className="my-1" />
REJEITADO
                    <div className="flex gap-2 justify-between">
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`} >
                            <span className="text-xs">
                                {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {message?.viewed && isOwnMessage && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    </div>
            </div>
        </div>
    )
}

function MessageProposalAccepted({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    const { user } = useAuth()
    const isProvider = user?.id === message?.sender_id;

    const { budget, observation } = JSON.parse(message?.content || '{}');

    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-md shadow-sm break-words  ${isOwnMessage
                    ? "bg-primary font-medium rounded-br-md"
                    : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
            >
                <p className="text-md leading-4">
                    {isProvider ? "Você enviou uma orçamento de" : request?.provider?.name.split(" ")?.[0] + " enviou um orçamento de "}: <span className="font-bold text-xl">{formatCurrency(Number(budget))}</span>
                </p>

                <p className="text-sm leading-relaxed">{observation}</p>

                <Separator className="my-1" />
ACEITADO
                    <div className="flex gap-2 justify-between">
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`} >
                            <span className="text-xs">
                                {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {message?.viewed && isOwnMessage && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    </div>
            </div>
        </div>
    )
}

function MessageProposalCancelled({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    const { user } = useAuth()
    const isProvider = user?.id === message?.sender_id;

    const { budget, observation } = JSON.parse(message?.content || '{}');

    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-md shadow-sm break-words  ${isOwnMessage
                    ? "bg-primary font-medium rounded-br-md"
                    : "bg-white font-medium text-gray-900 rounded-bl-md border border-gray-200"
                    }`}
            >
                <p className="text-md leading-4">
                    {isProvider ? "Você enviou uma orçamento de" : request?.provider?.name.split(" ")?.[0] + " enviou um orçamento de "}: <span className="font-bold text-xl">{formatCurrency(Number(budget))}</span>
                </p>

                <p className="text-sm leading-relaxed">{observation}</p>

                <Separator className="my-1" />
CANCELADO
                    <div className="flex gap-2 justify-between">
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`} >
                            <span className="text-xs">
                                {new Date(message?.createdAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {message?.viewed && isOwnMessage && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    </div>
            </div>
        </div>
    )
}
