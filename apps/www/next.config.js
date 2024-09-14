/** @type {import('next').NextConfig} */
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/

const devMode = process.env.NEXT_PUBLIC_APP_MODE === 'development';

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
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
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: "/fonts/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                ],
            },
            // {
            //     source: "/critical-path.css",
            //     headers: [
            //         { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            //     ],
            // },
        ];
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
    assetPrefix: devMode ? '' : 'https://cdn.asimthecat.com',
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
                hostname: 'cdn.asimthecat.com',
            }
        ],
        formats: ['image/webp'],
    },
}

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
  ];
  
module.exports = composePlugins(...plugins)(nextConfig);