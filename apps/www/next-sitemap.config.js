// next-sitemap.config.js
const devMode = process.env.NEXT_PUBLIC_APP_MODE === 'development';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040';

module.exports = devMode ? {
    siteUrl: process.env.NEXT_PUBLIC_WWW_URL || 'http://localhost:3050',
    generateRobotsTxt: false,
    sitemapSize: 7000,
} : {
    siteUrl: process.env.NEXT_PUBLIC_WWW_URL || 'http://localhost:3050',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    async transform(config, path) {
        if (path !== '/dynamic-path') {
            return {
                loc: path,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            };
        }

        const response = await fetch(`${apiUrl}/api/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const { items } = data;

        const dynamicUrls = items.flatMap(category =>
            category.products.map(product => ({
                loc: `/menu/${category.slug}/${product.slug}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            }))
        );

        return dynamicUrls;
    },
    additionalPaths: async (config) => {
        const response = await fetch(`${apiUrl}/api/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const { items } = data;

        const dynamicPaths = items.flatMap(category =>
            category.products.map(product => ({
                loc: `/menu/${category.slug}/${product.slug}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            }))
        );

        return dynamicPaths;
    },
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
        ],
        additionalSitemaps: [
            `${process.env.NEXT_PUBLIC_WWW_URL}/sitemap.xml`,
        ],
    },
};
