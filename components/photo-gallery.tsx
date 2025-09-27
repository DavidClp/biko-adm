"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Eye, Upload } from "lucide-react";
import Image from "next/image";
import { ProviderPhoto } from "@/lib/provider-photos-api";
import { FileInput } from "@/components/ui/file-input";

interface PhotoGalleryProps {
  photos: ProviderPhoto[];
  providerId: string;
  isOwner?: boolean;
  onPhotoDelete?: (photoId: string) => void;
}

export function PhotoGallery({ 
  photos, 
  isOwner = false, 
  onPhotoDelete,
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProviderPhoto | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Vitrine de Trabalhos</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fotos dos serviços realizados
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-4">
              {isOwner ? "Nenhuma foto adicionada ainda" : "Nenhuma foto disponível"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={photo?.photo_url}
                    alt={photo?.description || "Foto do trabalho"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0  group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPhoto(photo)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {photo.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal para visualizar foto */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Foto do Trabalho</DialogTitle>
            </DialogHeader>
            {selectedPhoto && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full">
                  <Image
                    src={selectedPhoto.photo_url}
                    alt={selectedPhoto.description || "Foto do trabalho"}
                    fill
                    className="object-contain rounded-lg"
                    sizes="100vw"
                  />
                </div>
                {selectedPhoto.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Componente para upload de foto
interface PhotoUploadFormProps {
  providerId: string;
  onSuccess: (photo: ProviderPhoto) => void;
  onCancel: () => void;
  maxPhotos: number;
  currentPhotoCount: number;
}

function PhotoUploadForm({ providerId, onSuccess, onCancel, maxPhotos, currentPhotoCount }: PhotoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('description', description);

      const response = await fetch(`/api/provider-photos/${providerId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao fazer upload da foto');
      }

      const result = await response.json();
      onSuccess(result.data);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const canUpload = currentPhotoCount < maxPhotos;

  if (!canUpload) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Limite de fotos atingido</h3>
        <p className="text-muted-foreground mb-6">
          Você atingiu o limite de {maxPhotos} foto(s) do seu plano atual. 
          Atualize seu plano para adicionar mais fotos.
        </p>
        <Button onClick={onCancel}>Fechar</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FileInput
        onFileSelect={setFile}
        accept="image/*"
        maxSize={5}
        label="Selecione uma foto"
        placeholder="Arraste uma imagem ou clique para selecionar"
        value={file}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o trabalho realizado..."
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/200 caracteres
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            "Adicionar Foto"
          )}
        </Button>
      </div>
    </form>
  );
}
