/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com/api' 
      : 'http://localhost:12001/api'
  }
}

module.exports = nextConfig