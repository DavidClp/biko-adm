"use client";

import { useState } from "react";
import { Message } from "@/lib/types";
import { formatDateWithTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MessageImageProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageImage({ message, isOwnMessage }: MessageImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleImageError = (e: any) => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };


  // Adicionar token de autenticação à URL da imagem
  const getImageUrlWithAuth = () => {
    if (!message.content) return '';
    
    const token = localStorage.getItem('token');
    if (token) {
      const urlWithToken = `${message.content}?token=${token}`;
      return urlWithToken;
    }
    return message.content;
  };

  const handleImageClick = () => {
    if (!imageError && message.content) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className={cn(
      "flex mb-4",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[280px] space-y-1",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <Card className={cn(
          "overflow-hidden",
          isOwnMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <CardContent className="p-0">
            {imageError ? (
              <div className="w-full h-48 bg-muted-foreground/10 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Erro ao carregar imagem
                </p>
              </div>
            ) : (
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <img
                  src={getImageUrlWithAuth()}
                  alt="Imagem enviada"
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleImageClick}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className={cn(
          "flex items-center gap-2 text-xs",
          isOwnMessage ? "justify-end" : "justify-start"
        )}>
          <span className="text-muted-foreground">
            {formatDateWithTime(message.createdAt)}
          </span>
          
          {isOwnMessage && (
            <div className="flex items-center">
              {message.viewed ? (
                <CheckCircle className="h-3 w-3 text-blue-500" />
              ) : (
                <Clock className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagem em tamanho completo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex items-center justify-center p-4">
              <img
                src={getImageUrlWithAuth()}
                alt="Imagem enviada"
                className="max-w-full max-h-[85vh] object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
