import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerPhotosApi, ProviderPhoto } from '@/lib/provider-photos-api';
import { useToast } from './use-toast';

interface UseProviderPhotosProps {
  providerId: string;
}

export function useProviderPhotos({ providerId }: UseProviderPhotosProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar fotos do provider
  const photosQuery = useQuery({
    queryKey: ['provider-photos', providerId],
    queryFn: async () => {
      const result = await providerPhotosApi.list(providerId);
      return result.data || [];
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });

  // Mutation para upload de foto
  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ file, description }: { file: File; description?: string }) => {
      return await providerPhotosApi.upload(providerId, file, { description });
    },
    onSuccess: (newPhoto) => {
      // Atualizar o cache com a nova foto
      queryClient.setQueryData(['provider-photos', providerId], (oldPhotos: ProviderPhoto[] = []) => [
        ...oldPhotos,
        newPhoto
      ]);

      toast({
        title: "Sucesso",
        description: "Foto adicionada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || 'Erro desconhecido',
        variant: "destructive",
      });
      console.error('Erro ao fazer upload:', error);
    },
  });

  // Mutation para deletar foto
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await providerPhotosApi.delete(photoId);
      return photoId;
    },
    onSuccess: (photoId) => {
      // Remover a foto do cache
      queryClient.setQueryData(['provider-photos', providerId], (oldPhotos: ProviderPhoto[] = []) =>
        oldPhotos.filter(photo => photo.id !== photoId)
      );

      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || 'Erro desconhecido',
        variant: "destructive",
      });
      console.error('Erro ao deletar foto:', error);
    },
  });

  // Mutation para atualizar foto
  const updatePhotoMutation = useMutation({
    mutationFn: async ({ photoId, data }: { photoId: string; data: { description?: string; order?: number } }) => {
      return await providerPhotosApi.update(photoId, data);
    },
    onSuccess: (updatedPhoto) => {
      // Atualizar a foto no cache
      queryClient.setQueryData(['provider-photos', providerId], (oldPhotos: ProviderPhoto[] = []) =>
        oldPhotos.map(photo =>
          photo.id === updatedPhoto.id ? updatedPhoto : photo
        )
      );

      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || 'Erro desconhecido',
        variant: "destructive",
      });
      console.error('Erro ao atualizar foto:', error);
    },
  });

  return {
    photos: photosQuery.data || [],
    isLoading: photosQuery.isLoading,
    error: photosQuery.error?.message || null,
    refetch: photosQuery.refetch,
    uploadPhoto: (file: File, description?: string) => uploadPhotoMutation.mutate({ file, description }),
    deletePhoto: (photoId: string) => deletePhotoMutation.mutate(photoId),
    updatePhoto: (photoId: string, data: { description?: string; order?: number }) =>    updatePhotoMutation.mutate({ photoId, data }),
    isUploading: uploadPhotoMutation.isPending,
    isDeleting: deletePhotoMutation.isPending,
    isUpdating: updatePhotoMutation.isPending,
  };
}