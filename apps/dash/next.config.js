/** @type {import('next').NextConfig} */
const { composePlugins, withNx } = require('@nx/next');

const devMode = process.env.NODE_ENV === 'development';

const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                basePath: false,
                permanent: false
            }
        ]
    },
    reactStrictMode: true,
    experimental: {
        turbo: {
            rules: {},
        },
    },
    assetPrefix: '',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'cdn.thecacao.com.tr',
            },
            {
                protocol: 'https',
                hostname: 'thecacao.com.tr',
            },
            {
                protocol: 'https',
                hostname: 'api.thecacao.com.tr',
            },
        ],
        formats: ['image/webp'],
    },
}

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
