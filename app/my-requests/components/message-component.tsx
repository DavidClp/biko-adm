import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { IRequestService, Message } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export function MessageComponent({ message, isOwnMessage, request }: { message: Message, isOwnMessage: boolean, request: IRequestService }) {
    switch (message.type) {
        case "TEXT":
            return <MessageText message={message} isOwnMessage={isOwnMessage} />
        case "PROPOSAL":
            return <MessageProposal message={message} isOwnMessage={isOwnMessage} request={request} />
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
                <p className="text-sm leading-relaxed">{isProvider ? "Você enviou um orçamento de" : request?.provider?.name.split(" ")?.[0] + " enviou um orçamento de"}: {formatCurrency(Number(message.content))}</p>
                {/* <p className="text-sm leading-relaxed">{message?.observation}</p> */}
                <Separator className="my-1" />

                <div className="flex gap-2">
                    {!isProvider && (
                        <Button variant="secondary" className="" size="sm">
                            Aceitar orçamento
                        </Button>
                    )}

                    {!isProvider && (
                        <Button variant="destructive" className="" size="sm">
                            Rejeitar orçamento
                        </Button>
                    )}
                </div>

                {isProvider && (
                    <Button variant="destructive" className="w-full" size="sm">
                        Cancelar orçamento
                    </Button>
                )}

                <div
                    className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-accent-foreground" : "text-accent-foreground"}`}
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
