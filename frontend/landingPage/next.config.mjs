/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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

export default nextConfig
