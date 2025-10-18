import { BannerPosition, BannerSize } from "@/components/banner-preview";

export interface BannerImageSpecs {
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  recommendedFormat: string;
}

export function getBannerImageSpecs(position: BannerPosition, size: BannerSize): BannerImageSpecs {
  const specs: Record<string, BannerImageSpecs> = {
    // PROVIDERS_LIST_TOP
    'PROVIDERS_LIST_TOP_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 200,
      aspectRatio: '1.875:1',
      description: 'Banner horizontal no topo da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_TOP_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 120,
      aspectRatio: '1.5:1',
      description: 'Banner compacto no topo da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_TOP_MOBILE_SQUARE': {
      width: 200,
      height: 200,
      aspectRatio: '1:1',
      description: 'Banner quadrado no topo da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_TOP_MOBILE_RECTANGLE': {
      width: 300,
      height: 200,
      aspectRatio: '1.5:1',
      description: 'Banner retangular no topo da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },

    // PROVIDERS_LIST_MIDDLE
    'PROVIDERS_LIST_MIDDLE_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 150,
      aspectRatio: '2.5:1',
      description: 'Banner horizontal no meio da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_MIDDLE_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 100,
      aspectRatio: '1.8:1',
      description: 'Banner compacto no meio da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_MIDDLE_MOBILE_SQUARE': {
      width: 150,
      height: 150,
      aspectRatio: '1:1',
      description: 'Banner quadrado no meio da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_MIDDLE_MOBILE_RECTANGLE': {
      width: 280,
      height: 150,
      aspectRatio: '1.87:1',
      description: 'Banner retangular no meio da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },

    // PROVIDERS_LIST_BOTTOM
    'PROVIDERS_LIST_BOTTOM_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 180,
      aspectRatio: '2.08:1',
      description: 'Banner horizontal no final da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_BOTTOM_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 110,
      aspectRatio: '1.64:1',
      description: 'Banner compacto no final da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_BOTTOM_MOBILE_SQUARE': {
      width: 160,
      height: 160,
      aspectRatio: '1:1',
      description: 'Banner quadrado no final da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDERS_LIST_BOTTOM_MOBILE_RECTANGLE': {
      width: 300,
      height: 180,
      aspectRatio: '1.67:1',
      description: 'Banner retangular no final da lista de providers',
      recommendedFormat: 'JPEG ou PNG'
    },

    // PROVIDER_DETAIL_TOP
    'PROVIDER_DETAIL_TOP_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 220,
      aspectRatio: '1.7:1',
      description: 'Banner horizontal no topo da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_TOP_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 130,
      aspectRatio: '1.38:1',
      description: 'Banner compacto no topo da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_TOP_MOBILE_SQUARE': {
      width: 200,
      height: 200,
      aspectRatio: '1:1',
      description: 'Banner quadrado no topo da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_TOP_MOBILE_RECTANGLE': {
      width: 320,
      height: 220,
      aspectRatio: '1.45:1',
      description: 'Banner retangular no topo da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },

    // PROVIDER_DETAIL_SIDEBAR
    'PROVIDER_DETAIL_SIDEBAR_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 100,
      aspectRatio: '3.75:1',
      description: 'Banner horizontal na sidebar da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_SIDEBAR_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 80,
      aspectRatio: '2.25:1',
      description: 'Banner compacto na sidebar da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_SIDEBAR_MOBILE_SQUARE': {
      width: 120,
      height: 120,
      aspectRatio: '1:1',
      description: 'Banner quadrado na sidebar da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },
    'PROVIDER_DETAIL_SIDEBAR_MOBILE_RECTANGLE': {
      width: 280,
      height: 100,
      aspectRatio: '2.8:1',
      description: 'Banner retangular na sidebar da página de detalhes',
      recommendedFormat: 'JPEG ou PNG'
    },

    // DASHBOARD_TOP
    'DASHBOARD_TOP_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 160,
      aspectRatio: '2.34:1',
      description: 'Banner horizontal no topo do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_TOP_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 90,
      aspectRatio: '2:1',
      description: 'Banner compacto no topo do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_TOP_MOBILE_SQUARE': {
      width: 140,
      height: 140,
      aspectRatio: '1:1',
      description: 'Banner quadrado no topo do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_TOP_MOBILE_RECTANGLE': {
      width: 300,
      height: 160,
      aspectRatio: '1.875:1',
      description: 'Banner retangular no topo do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },

    // DASHBOARD_SIDEBAR
    'DASHBOARD_SIDEBAR_MOBILE_FULL_WIDTH': {
      width: 375,
      height: 120,
      aspectRatio: '3.125:1',
      description: 'Banner horizontal na sidebar do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_SIDEBAR_MOBILE_HALF_WIDTH': {
      width: 180,
      height: 70,
      aspectRatio: '2.57:1',
      description: 'Banner compacto na sidebar do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_SIDEBAR_MOBILE_SQUARE': {
      width: 100,
      height: 100,
      aspectRatio: '1:1',
      description: 'Banner quadrado na sidebar do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    },
    'DASHBOARD_SIDEBAR_MOBILE_RECTANGLE': {
      width: 280,
      height: 120,
      aspectRatio: '2.33:1',
      description: 'Banner retangular na sidebar do dashboard',
      recommendedFormat: 'JPEG ou PNG'
    }
  };

  const key = `${position}_${size}`;
  return specs[key] || {
    width: 375,
    height: 200,
    aspectRatio: '1.875:1',
    description: 'Banner padrão',
    recommendedFormat: 'JPEG ou PNG'
  };
}

export const BANNER_POSITIONS = [
  { value: 'PROVIDERS_LIST_TOP', label: 'Lista de Providers - Topo' },
  { value: 'PROVIDERS_LIST_MIDDLE', label: 'Lista de Providers - Meio' },
  { value: 'PROVIDERS_LIST_BOTTOM', label: 'Lista de Providers - Final' },
  { value: 'PROVIDER_DETAIL_TOP', label: 'Detalhes do Provider - Topo' },
  { value: 'PROVIDER_DETAIL_SIDEBAR', label: 'Detalhes do Provider - Sidebar' },
  { value: 'DASHBOARD_TOP', label: 'Dashboard - Topo' },
  { value: 'DASHBOARD_SIDEBAR', label: 'Dashboard - Sidebar' },
];

export const BANNER_SIZES = [
  { value: 'MOBILE_FULL_WIDTH', label: 'Mobile - Largura Completa' },
  { value: 'MOBILE_HALF_WIDTH', label: 'Mobile - Meia Largura' },
  { value: 'MOBILE_SQUARE', label: 'Mobile - Quadrado' },
  { value: 'MOBILE_RECTANGLE', label: 'Mobile - Retângulo' },
];
