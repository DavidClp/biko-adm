"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImagePickerProps {
  onImageSelect: (file: File) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePicker({ onImageSelect, isOpen, onClose }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSendImage = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
      setSelectedFile(null);
      setPreview(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enviar Imagem</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendImage} className="flex-1">
                Enviar Imagem
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Escolha como deseja enviar a imagem
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleGalleryClick}
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-sm">Galeria</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCameraClick}
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Câmera</span>
              </Button>
            </div>

            <div className="text-center">
              <Button variant="outline" color="red" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
