// Componente temporário para debugar envio de imagens
import { useCallback } from 'react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useImageMessageDebug } from '@/hooks/use-chat-debug';
import { useChat } from '@/hooks/use-chat';

export function DebugImageUpload() {
  const uploadImageMutation = useImageUpload();
  const { debugSendImageMessage } = useImageMessageDebug();
  const { sendImageMessage, selectedRequestId, toUserId, providerId } = useChat();

  const handleImageSelect = useCallback(async (file: File) => {
    console.log('🔍 DEBUG handleImageSelect chamado com arquivo:', file.name);
    
    if (!selectedRequestId) {
      console.log('❌ selectedRequestId não disponível');
      return;
    }

    console.log('📤 Fazendo upload da imagem...');
    
    uploadImageMutation.mutate({
      file,
      requestId: selectedRequestId
    }, {
      onSuccess: (data) => {
        console.log('✅ Upload bem-sucedido, dados recebidos:', data);
        
        // Usar função de debug
        debugSendImageMessage(data.imageUrl, selectedRequestId, toUserId, providerId);
        
        // Também tentar função original
        console.log('📤 Tentando função original sendImageMessage...');
        sendImageMessage(data.imageUrl);
      },
      onError: (error) => {
        console.log('❌ Erro no upload:', error);
      }
    });
  }, [selectedRequestId, uploadImageMutation, debugSendImageMessage, sendImageMessage, toUserId, providerId]);

  return {
    handleImageSelect,
    isUploading: uploadImageMutation.isPending
  };
}
