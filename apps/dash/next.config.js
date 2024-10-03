/** @type {import('next').NextConfig} */
const { composePlugins, withNx } = require('@nx/next');

const devMode = process.env.NEXT_PUBLIC_APP_MODE === 'development';

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    disable: devMode === 'development',  
    skipWaiting: true
})

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
    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    nx: {
      svgr: false,
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
    withPWA,
];

module.exports = composePlugins(...plugins)(nextConfig);
