/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.VITE_API_URL || 'http://api-gateway:8000'}/:path*`,
      },
    ]
  },
}
export default nextConfig
