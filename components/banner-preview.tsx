"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBannerImageSpecs, BANNER_POSITIONS, BANNER_SIZES } from '@/lib/banner-specs';

export type BannerPosition = 'PROVIDERS_LIST_TOP' | 'PROVIDERS_LIST_MIDDLE' | 'PROVIDERS_LIST_BOTTOM' | 'PROVIDER_DETAIL_TOP' | 'PROVIDER_DETAIL_SIDEBAR' | 'DASHBOARD_TOP' | 'DASHBOARD_SIDEBAR';

export type BannerSize = 'MOBILE_FULL_WIDTH' | 'MOBILE_HALF_WIDTH' | 'MOBILE_SQUARE' | 'MOBILE_RECTANGLE';

interface BannerPreviewProps {
  position: BannerPosition;
  size: BannerSize;
  imageUrl?: string;
  title?: string;
  description?: string;
}

export function BannerPreview({ 
  position, 
  size, 
  imageUrl, 
  title = "Título do Banner", 
  description = "Descrição do banner",
}: BannerPreviewProps) {
  const [specs, setSpecs] = useState<any>(null);

  useEffect(() => {
    // Simular as especificações baseadas na posição e tamanho
    const mockSpecs = getBannerImageSpecs(position, size);
    setSpecs(mockSpecs);
  }, [position, size]);

  if (!specs) return null;

  const getPreviewStyles = () => {
    const baseStyles = {
      width: Math.min(specs.width, 375), // Limitar largura máxima para preview
      height: Math.min(specs.height, 300), // Limitar altura máxima para preview
      aspectRatio: specs.aspectRatio.replace(':', '/'),
    };

    return baseStyles;
  };

  const getPositionLabel = () => {
    return BANNER_POSITIONS.find(p => p.value === position)?.label || position;
  };

  const getSizeLabel = () => {
    return BANNER_SIZES.find(s => s.value === size)?.label || size;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Preview do Banner</CardTitle>
            <CardDescription>
              {getPositionLabel()} • {getSizeLabel()}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {specs.width} × {specs.height}px
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview do banner */}
        <div className="flex justify-center">
          <div 
            className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
            style={getPreviewStyles()}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview do banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm">Nenhuma imagem</div>
                </div>
              </div>
            )}
            
            {/* Overlay com informações */}
            {imageUrl && (
              <div className="absolute inset-0 hover:bg-opacity-20 transition-all duration-300 flex items-end">
                <div className="w-full p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xs font-medium truncate">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-white/80 text-xs truncate">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Especificações técnicas */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dimensões:</span>
            <span className="font-medium">{specs.width} × {specs.height}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proporção:</span>
            <span className="font-medium">{specs.aspectRatio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Formato recomendado:</span>
            <span className="font-medium">{specs.recommendedFormat}</span>
          </div>
          <div className="pt-2">
            <span className="text-muted-foreground">Descrição:</span>
            <p className="text-xs mt-1 text-gray-600">{specs.description}</p>
          </div>
        </div>

        {/* Link de destino */}
       {/*  {imageUrl && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Link de destino:</span>
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {imageUrl}
              </a>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}

