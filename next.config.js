/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar output standalone para Docker
  output: 'standalone',
  
  // Otimizações de build (Next.js 15)
  experimental: {
    // Otimizar imports de pacotes comuns
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      'date-fns',
      'react-icons'
    ],
  },
  
  // Configuração de imagens
  images: {
    // Formatos otimizados
    formats: ['image/webp', 'image/avif'],
    // Cache de imagens (24 horas)
    minimumCacheTTL: 86400,
  },
  
  // Webpack otimizações
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Otimizar bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Compressão habilitada
  compress: true,
  
  // Headers de cache para assets estáticos
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;