/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile shared packages for mono-repo
  transpilePackages: [
    '@scienceviddb/shared',
    '@scienceviddb/db',
    '@scienceviddb/gcp-utils',
  ],
  // Output configuration
  output: 'standalone',
}

module.exports = nextConfig

