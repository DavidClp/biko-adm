/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'biko.s3.amazonaws.com',
        port: '',
        pathname: '/**',
        search: ''
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/messages/image/**',
        search: ''
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

export default nextConfig
