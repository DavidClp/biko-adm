"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";
import { socket } from "@/lib/socket";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChatNotificationsProps {
  userId?: string;
  onNewMessage?: (message: Message) => void;
}

export function ChatNotifications({ userId, onNewMessage }: ChatNotificationsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          setPermissionGranted(permission === 'granted');
        });
      }
    }
  }, []);

  // Configurar listeners de notificação
  useEffect(() => {
    if (!userId || !permissionGranted) return;

    const handleNewMessage = (message: Message) => {
      if (notificationsEnabled) {
        // Mostrar notificação do navegador
        const notification = new Notification('Nova mensagem', {
          body: message.content,
          icon: '/placeholder-logo.png',
          tag: `message-${message.id}`,
          requireInteraction: true
        });

        // Reproduzir som se habilitado
        if (soundEnabled) {
          playNotificationSound();
        }

        // Mostrar toast
        toast({
          title: "Nova mensagem",
          description: message.content,
          duration: 5000,
        });

        // Notificar componente pai
        onNewMessage?.(message);

        // Fechar notificação após 5 segundos
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    };

    const handleChatNotification = (data: { message: Message, requestId: string, senderId: string }) => {
      if (data.senderId !== userId) {
        handleNewMessage(data.message);
      }
    };

    // Registrar listeners
    socket.on("chat:notification", handleChatNotification);
    socket.on("chat:new_message", handleNewMessage);

    return () => {
      socket.off("chat:notification", handleChatNotification);
      socket.off("chat:new_message", handleNewMessage);
    };
  }, [userId, notificationsEnabled, soundEnabled, permissionGranted, onNewMessage]);

  // Função para reproduzir som de notificação
  const playNotificationSound = () => {
 /*    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback para som do sistema
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      });
    } catch (error) {
      console.log('Erro ao reproduzir som de notificação:', error);
    } */
  };

  // Função para testar notificação
  const testNotification = () => {
    if (permissionGranted && notificationsEnabled) {
    /*   const testMessage: Message = {
        id: 'test',
        content: 'Esta é uma notificação de teste',
        sender_id: 'test',
        receiver_id: userId || '',
        request_id: 'test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewed: false
      };
      
      const notification = new Notification('Teste de Notificação', {
        body: 'Esta é uma notificação de teste',
        icon: '/placeholder-logo.png'
      });

      if (soundEnabled) {
        playNotificationSound();
      }

      setTimeout(() => notification.close(), 3000); */
    }
  };

  if (!permissionGranted) {
    return (
      <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <BellOff className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-yellow-800">
          Notificações bloqueadas. Habilite nas configurações do navegador.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notificações de Chat</span>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <Label htmlFor="sound-toggle">Som de notificação</Label>
        </div>
        <Switch
          id="sound-toggle"
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
          disabled={!notificationsEnabled}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={testNotification}
        disabled={!notificationsEnabled}
        className="w-full"
      >
        Testar Notificação
      </Button>
    </div>
  );
}
