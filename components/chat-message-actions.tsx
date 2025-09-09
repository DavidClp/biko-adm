"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Reply,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Laugh,
  Angry,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Flag
} from "lucide-react";
import { Message } from "@/lib/types";

interface ChatMessageActionsProps {
  message: Message;
  currentUserId?: string;
  onReply?: (messageId: string, content: string) => void;
  onReaction?: (messageId: string, reaction: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (messageId: string, reason: string) => void;
}

const REACTIONS = [
  { emoji: "❤️", name: "heart", icon: Heart },
  { emoji: "👍", name: "thumbs_up", icon: ThumbsUp },
  { emoji: "👎", name: "thumbs_down", icon: ThumbsDown },
  { emoji: "😂", name: "laugh", icon: Laugh },
  { emoji: "😡", name: "angry", icon: Angry },
];

export function ChatMessageActions({
  message,
  currentUserId,
  onReply,
  onReaction,
  onEdit,
  onDelete,
  onReport
}: ChatMessageActionsProps) {
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(message.content);
  const [reportReason, setReportReason] = useState("");

  const isOwnMessage = message.sender_id === currentUserId;
  const [reactions, setReactions] = useState<Record<string, string[]>>({});

  const handleReaction = (reaction: string) => {
    const currentReactions = reactions[message.id] || [];
    const hasReacted = currentReactions.includes(currentUserId || "");
    
    let newReactions;
    if (hasReacted) {
      newReactions = currentReactions.filter(id => id !== currentUserId);
    } else {
      newReactions = [...currentReactions, currentUserId || ""];
    }
    
    setReactions(prev => ({
      ...prev,
      [message.id]: newReactions
    }));
    
    onReaction?.(message.id, reaction);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(message.id, replyContent.trim());
      setReplyContent("");
      setShowReplyDialog(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
      setShowEditDialog(false);
    }
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport?.(message.id, reportReason.trim());
      setReportReason("");
      setShowReportDialog(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  const getReactionCount = (reaction: string) => {
    return reactions[message.id]?.filter(id => id === reaction).length || 0;
  };

  return (
    <>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Reações rápidas */}
        <div className="flex items-center gap-1">
          {REACTIONS.slice(0, 3).map((reaction) => {
            const Icon = reaction.icon;
            const count = getReactionCount(reaction.name);
            
            return (
              <Button
                key={reaction.name}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-gray-100"
                onClick={() => handleReaction(reaction.name)}
              >
                <span className="text-sm">{reaction.emoji}</span>
                {count > 0 && (
                  <span className="ml-1 text-xs text-gray-500">{count}</span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Menu de ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowReplyDialog(true)}>
              <Reply className="w-4 h-4 mr-2" />
              Responder
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </DropdownMenuItem>

            {isOwnMessage && (
              <>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}

            {!isOwnMessage && (
              <DropdownMenuItem onClick={() => setShowReportDialog(true)} className="text-red-600">
                <Flag className="w-4 h-4 mr-2" />
                Denunciar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de resposta */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder mensagem</DialogTitle>
            <DialogDescription>
              Respondendo à mensagem: "{message.content}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite sua resposta..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReply} disabled={!replyContent.trim()}>
              Enviar Resposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar mensagem</DialogTitle>
            <DialogDescription>
              Edite o conteúdo da sua mensagem.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={!editContent.trim() || editContent === message.content}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de denúncia */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Denunciar mensagem</DialogTitle>
            <DialogDescription>
              Descreva o motivo da denúncia para esta mensagem.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Descreva o motivo da denúncia..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReport} disabled={!reportReason.trim()} className="bg-red-600 hover:bg-red-700">
              Enviar Denúncia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
