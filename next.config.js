/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'bar2917.ru',
              pathname: '/assets/**',
            },
        ]
    },
}

module.exports = nextConfig
