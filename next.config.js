/** @type {import('next').NextConfig} */
const nextConfig = {
    // Habilitar output standalone para Docker
    output: 'standalone',
    
    // Desabilitar telemetria
    telemetry: {
      disabled: true
    },
    
    // Otimizações de build
    experimental: {
      // Usar SWC minifier (mais rápido)
      swcMinify: true,
      
      // Otimizar imports
      optimizePackageImports: [
        '@mui/material',
        '@mui/icons-material',
        'lodash',
        'date-fns'
      ]
    },
    
    // Configuração de imagens
    images: {
      // Otimizar imagens
      formats: ['image/webp', 'image/avif'],
      
      // Cache de imagens
      minimumCacheTTL: 86400, // 24 horas
    },
    
    // Webpack otimizações
    webpack: (config, { dev, isServer }) => {
      // Produção apenas
      if (!dev) {
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
        
        // Remover console.log em produção
        config.optimization.minimizer[0].options.minimizer.options.compress.drop_console = true;
      }
      
      return config;
    },
    
    // Compressão
    compress: true,
    
    // Headers de cache
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