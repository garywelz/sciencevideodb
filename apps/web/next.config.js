/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable edge runtime for API routes where appropriate
  experimental: {
    serverActions: true,
  },
  // Transpile shared package
  transpilePackages: ['@scienceviddb/shared'],
}

module.exports = nextConfig

