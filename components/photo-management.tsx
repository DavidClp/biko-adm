"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Image as ImageIcon, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useProviderPhotos } from "@/hooks/use-provider-photos";
import { useToast } from "@/hooks/use-toast";
import { ProviderPhoto } from "@/lib/provider-photos-api";
import { FileInput } from "@/components/ui/file-input";

interface PhotoManagementProps {
  providerId: string;
  maxPhotos: number;
  planName: string;
}

export function PhotoManagement({ providerId, maxPhotos, planName }: PhotoManagementProps) {
  const { photos, uploadPhoto, deletePhoto, updatePhoto, isLoading } = useProviderPhotos({ providerId });
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<ProviderPhoto | null>(null);
  const [editDescription, setEditDescription] = useState("");

  const canAddMorePhotos = photos.length < maxPhotos;

  const handleUpload = async (file: File, description?: string) => {
    uploadPhoto(file, description);
    setIsUploadModalOpen(false);
  };

  const handleDelete = async (photoId: string) => {
    if (confirm("Tem certeza que deseja remover esta foto?")) {
      await deletePhoto(photoId);
    }
  };

  const handleEdit = (photo: ProviderPhoto) => {
    setEditingPhoto(photo);
    setEditDescription(photo.description || "");
  };

  const handleSaveEdit = async () => {
    if (!editingPhoto) return;
    
    updatePhoto(editingPhoto.id, {
      description: editDescription,
    });
    
    setEditingPhoto(null);
    setEditDescription("");
  };

  const getPlanInfo = () => {
    if (planName.toUpperCase().includes('PRESTADOR')) {
      return { maxPhotos: 5, color: 'bg-blue-100 text-blue-800' };
    } else if (planName.toUpperCase().includes('PROFISSIONAL+')) {
      return { maxPhotos: 10, color: 'bg-purple-100 text-purple-800' };
    } else {
      return { maxPhotos: 1, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const planInfo = getPlanInfo();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Gerenciar Vitrine</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as fotos dos seus trabalhos realizados
            </p>
          </div>
          <div className="flex items-center gap-2 justify-between w-full sm:w-auto">
            <Badge className={planInfo.color}>
              {planName} - {photos.length}/{planInfo.maxPhotos} fotos
            </Badge>
            {canAddMorePhotos && (
              <Button
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-4">
              Nenhuma foto adicionada ainda
            </p>
            {canAddMorePhotos && (
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira foto
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg p-4 space-y-3">
                  <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={photo.photo_url}
                      alt={photo.description || "Foto do trabalho"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs font-medium">Descrição</Label>
                      <p className="text-sm text-muted-foreground">
                        {photo.description || "Sem descrição"}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(photo)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(photo.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal para upload de foto */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Foto</DialogTitle>
            </DialogHeader>
            <PhotoUploadForm
              onUpload={handleUpload}
              onCancel={() => setIsUploadModalOpen(false)}
              maxPhotos={maxPhotos}
              currentPhotoCount={photos.length}
            />
          </DialogContent>
        </Dialog>

        {/* Modal para editar foto */}
        <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Foto</DialogTitle>
            </DialogHeader>
            {editingPhoto && (
              <div className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={editingPhoto.photo_url}
                    alt={editingPhoto.description || "Foto do trabalho"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Descreva o trabalho realizado..."
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editDescription.length}/200 caracteres
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Salvar Alterações
                  </Button>
                </div>
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
  onUpload: (file: File, description?: string) => void;
  onCancel: () => void;
  maxPhotos: number;
  currentPhotoCount: number;
}

function PhotoUploadForm({ onUpload, onCancel, maxPhotos, currentPhotoCount }: PhotoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    setIsUploading(true);
    await onUpload(file, description);
    setIsUploading(false);
  };

  const canUpload = currentPhotoCount < maxPhotos;

  if (!canUpload) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">
          Você atingiu o limite de {maxPhotos} foto(s) do seu plano atual.
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
