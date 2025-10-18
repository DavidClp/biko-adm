"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadBannerProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
  inputId?: string;
}

export function ImageUploadBanner({ onImageUploaded, currentImageUrl, disabled, inputId = "banner-image-upload" }: ImageUploadBannerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Apenas arquivos JPEG, PNG e WebP são permitidos');
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('O arquivo deve ter no máximo 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Criar URL temporária para preview
      const tempUrl = URL.createObjectURL(file);
      onImageUploaded(tempUrl);

      // Armazenar o arquivo para envio posterior
      (event.target as any).uploadedFile = file;
    } catch (err) {
      setError('Erro ao processar a imagem');
      console.error('Erro no upload:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview da imagem atual */}
      {currentImageUrl && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onImageUploaded('')}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload de nova imagem */}
      <div className="space-y-2">
        <Label htmlFor={inputId}>Imagem do Banner</Label>
        <div className="flex items-center gap-4">
          <Input
            id={inputId}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={uploading || disabled}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(inputId)?.click()}
            disabled={uploading || disabled}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Enviando...' : 'Upload'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB
        </p>
      </div>

      {/* Campos para URL manual */}
   {/*    <div className="space-y-2">
        <Label htmlFor="banner-image-url">Ou cole a URL da imagem</Label>
        <div className="flex items-center gap-2">
          <Input
            id="banner-image-url"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={currentImageUrl || ''}
            onChange={(e) => onImageUploaded(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = document.getElementById('banner-image-url')?.value;
              if (url) {
                onImageUploaded(url);
              }
            }}
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
