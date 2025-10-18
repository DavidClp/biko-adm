"use client"

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useBannersByPosition } from '@/hooks/use-banners';
import { useIncrementBannerClick, useIncrementBannerView } from '@/hooks/use-banner-mutations';
import Image from 'next/image';
import { getBannerImageSpecs } from '@/lib/banner-specs';
import { BannerPosition, BannerSize } from './banner-preview';
import { useAuth } from '@/hooks/use-auth';

interface BannerDisplayProps {
  position: BannerPosition;
  classNameCustom?: string;
}

export function BannerDisplay({ position, classNameCustom = '' }: BannerDisplayProps) {
  const userRole = useAuth()?.user?.role;
  console.log('userRole', userRole);
  const { data: banners = [], error } = useBannersByPosition(position, userRole);
  const [viewedBanners, setViewedBanners] = useState<Set<string>>(new Set());

  const incrementClickMutation = useIncrementBannerClick();
  const incrementViewMutation = useIncrementBannerView();

  const handleBannerClick = async (bannerId: string, linkUrl?: string) => {
    try {
      // Registrar clique no servidor
      incrementClickMutation.mutate(bannerId);

      // Redirecionar para o link se existir  
      /*    if (linkUrl) {
           window.open(linkUrl, '_blank', 'noopener,noreferrer');
         } */
    } catch (error) {
      console.error('Erro ao registrar clique no banner:', error);
    }
  };

  const handleBannerView = async (bannerId: string) => {
    if (!viewedBanners.has(bannerId)) {
      try {
        incrementViewMutation.mutate(bannerId);
        setViewedBanners(prev => new Set([...prev, bannerId]));
      } catch (error) {
        console.error('Erro ao registrar visualização do banner:', error);
      }
    }
  };

  if (error || !banners || banners.length === 0) {
    return null; // Não exibe nada se não houver banners
  }

  // Seleciona um banner aleatório da lista
  const randomBanner = banners[Math.floor(Math.random() * banners.length)];

  const maxWidth = getBannerImageSpecs(randomBanner?.position, randomBanner?.size)?.width;

  return (
    <div className={`banner-container flex justify-center ${classNameCustom}`}>
      <div
        className={`relative cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 max-w-[${maxWidth}px]`}
        onClick={() => handleBannerClick(randomBanner.id, randomBanner?.imageUrl)}
        onMouseEnter={() => handleBannerView(randomBanner.id)}
      >
        <Image
          width={getBannerImageSpecs(randomBanner?.position, randomBanner?.size).width}
          height={getBannerImageSpecs(randomBanner?.position, randomBanner?.size).height}
          src={randomBanner?.imageUrl}
          alt={randomBanner?.title}
          className=""
        />

        {/* Overlay com informações do banner */}
        <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
          <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-sm font-medium truncate">
              {randomBanner?.title}
            </h3>
            {randomBanner?.description && (
              <p className="text-white/80 text-xs truncate mt-1">
                {randomBanner?.description}
              </p>
            )}
            {/* {randomBanner?.linkUrl && (
              <div className="flex items-center mt-2 text-white/60">
                <ExternalLink className="w-3 h-3 mr-1" />
                <span className="text-xs">Clique para visitar</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Indicador de anúncio */}
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full opacity-70">
          Anúncio
        </div>
      </div>
    </div>
  );
}

// Componente específico para diferentes posições
export function ProvidersListBanner({ position }: { position: BannerPosition }) {
  const getClassName = () => {
    switch (position) {
      case 'PROVIDERS_LIST_TOP':
        return `mb-6`;
      case 'PROVIDERS_LIST_MIDDLE':
        return 'my-6';
      case 'PROVIDERS_LIST_BOTTOM':
        return 'mt-6';
      default:
        return '';
    }
  };

  return (
    <BannerDisplay
      position={position}
      classNameCustom={getClassName()}
    />
  );
}

export function ProviderDetailBanner({ position }: { position: 'PROVIDER_DETAIL_TOP' | 'PROVIDER_DETAIL_SIDEBAR' }) {
  const getClassName = () => {
    switch (position) {
      case 'PROVIDER_DETAIL_TOP':
        return 'mb-6';
      case 'PROVIDER_DETAIL_SIDEBAR':
        return 'sticky top-4';
      default:
        return '';
    }
  };

  return (
    <BannerDisplay
      position={position}
      classNameCustom={getClassName()}
    />
  );
}

export function DashboardBanner({ position }: { position: 'DASHBOARD_TOP' | 'DASHBOARD_SIDEBAR' }) {
  const getClassName = () => {
    switch (position) {
      case 'DASHBOARD_TOP':
        return 'mb-6';
      case 'DASHBOARD_SIDEBAR':
        return 'mb-4';
      default:
        return '';
    }
  };

  return (
    <BannerDisplay
      position={position}
      classNameCustom={getClassName()}
    />
  );
}
