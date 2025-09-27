import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { providerPhotosApi, ProviderPhoto } from '@/lib/provider-photos-api';

interface UseProviderPhotosProps {
  providerId: string;
}

export function useProviderPhotos({ providerId }: UseProviderPhotosProps) {
  const [photos, setPhotos] = useState<ProviderPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    if (!providerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await providerPhotosApi.list(providerId);
      setPhotos(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar fotos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async (file: File, description?: string): Promise<ProviderPhoto | null> => {
    try {
      const newPhoto = await providerPhotosApi.upload(providerId, file, { description });
      setPhotos(prev => [...prev, newPhoto]);
      
      toast({
        title: "Sucesso",
        description: "Foto adicionada com sucesso!",
      });
      
      return newPhoto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Erro ao fazer upload:', err);
      return null;
    }
  };

  const deletePhoto = async (photoId: string): Promise<boolean> => {
    try {
      await providerPhotosApi.delete(photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      
      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Erro ao deletar foto:', err);
      return false;
    }
  };

  const updatePhoto = async (photoId: string, data: { description?: string; order?: number }): Promise<boolean> => {
    try {
      const updatedPhoto = await providerPhotosApi.update(photoId, data);
      setPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId ? updatedPhoto : photo
        )
      );
      
      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Erro ao atualizar foto:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [providerId]);

  return {
    photos,
    isLoading,
    error,
    refetch: fetchPhotos,
    uploadPhoto,
    deletePhoto,
    updatePhoto,
  };
}
