import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // html2canvas uses canvas — ensure server-side it's not broken
  experimental: {},
}

export default nextConfig
