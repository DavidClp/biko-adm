import { Message } from "@/lib/types";
import { CheckCircle } from "lucide-react";

export function MessageComponent({ message, isOwnMessage }: { message: Message, isOwnMessage: boolean }) {
    return (
        <div
            key={message.id}
            className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-3xl shadow-sm break-words  ${isOwnMessage
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