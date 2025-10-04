/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
  /*   unoptimized: true, */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'biko.s3.amazonaws.com',
        port: '',
        pathname: '/**',
        search: ''
      },
    ],
  },
}

export default nextConfig
