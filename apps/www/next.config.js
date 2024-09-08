/** @type {import('next').NextConfig} */
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/

const devMode = process.env.NODE_ENV === 'development';

const nextConfig = {
    nx: {
      // Set this to true if you would like to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: false,
    },
    async redirects() {
      return [
        {
            source: '/',
            destination: '/menu',
            basePath: false,
            permanent: false
        }
      ]
    },
    // compress: true,
    reactStrictMode: true,
    // swcMinify: !devMode, // disabled for performance issue
    experimental: {
        turbo: {
            rules: {},
            // Add other turbo-specific configurations here
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
            {
                protocol: 'https',
                hostname: '7phvozox.mncdn.org',
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