/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiBase = (
      process.env.BACKEND_PROXY_URL || 'http://127.0.0.1:8000'
    ).replace(/\/$/, '')
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: `${apiBase}/api/v1/:path*`,
        },
      ],
      // Vite SPAs live under public/worker and public/manager (see npm run build:spas).
      // afterFiles: real files (e.g. /worker/assets/*) win; everything else falls back to index.html.
      afterFiles: [
        { source: '/worker', destination: '/worker/index.html' },
        { source: '/worker/', destination: '/worker/index.html' },
        { source: '/worker/:path*', destination: '/worker/index.html' },
        { source: '/manager', destination: '/manager/index.html' },
        { source: '/manager/', destination: '/manager/index.html' },
        { source: '/manager/:path*', destination: '/manager/index.html' },
      ],
    }
  },
}

module.exports = nextConfig
