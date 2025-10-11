import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface UploadImageResponse {
  imageUrl: string;
}

export function useImageUpload() {
  return useMutation({
    mutationFn: async ({ 
      file, 
      requestId 
    }: { 
      file: File; 
      requestId: string; 
    }): Promise<UploadImageResponse> => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('requestId', requestId);

      const { data } = await api.post<UploadImageResponse>('/messages/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const imageUrl = `${baseUrl}${data.imageUrl}`;
      
      return { ...data, imageUrl };
    },
    onSuccess: () => {
      toast({
        title: "Imagem enviada!",
        description: "A imagem foi enviada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });
}
