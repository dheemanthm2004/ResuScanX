/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.up.railway.app/api'
      : 'http://localhost:12001/api'
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['axios']
  }
}

module.exports = nextConfig