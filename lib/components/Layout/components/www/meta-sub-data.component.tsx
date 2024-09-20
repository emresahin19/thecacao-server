import React from 'react';
import Head from 'next/head';
import { logoImage, metaDescription, metaKeywords } from 'lib/constants';
import { MetaDataProps } from 'lib/interfaces';
import { imageToCdnUrl } from 'lib/utils';

const MetaData: React.FC<MetaDataProps> = ({ name, image, src, description, slug, category, price, availability = true }) => {
    image = image || logoImage;
    const productDescription = `${name} ${description}`;
    const metaTitle = `${name} - The Cacao`;
    const twitterImage = imageToCdnUrl({ image, width: 1200, height: 630 });
    const canonicalUrl = `https://thecacao.com.tr/menu/${slug}`;

    return (
        <Head>
            <title>{metaTitle}</title>
            {src && <link rel="preload" href={src} as="image" />}
            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Meta Tags */}
            <meta name="description" content={productDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={productDescription} />
            <meta property="og:image" content={twitterImage} />
            <meta property="og:image:type" content="image/webp" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="product" />
            <meta property="og:site_name" content="The Cacao" />

            {/* Twitter Meta Tags */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={productDescription} />
            <meta property="twitter:image" content={twitterImage} />
            <meta property="twitter:image:width" content="1200" />
            <meta property="twitter:image:height" content="630" />
            <meta property="twitter:site" content="@TheCacao" />

            {/* Structured Data for Product */}
            
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "MenuItem",
                        "name": name,
                        "description": productDescription,
                        "image": [twitterImage],
                        "menuAddOn": category,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "TRY",
                            "price": price,
                            "availability": availability ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
                            "url": canonicalUrl,
                        },
                        "category": category,
                    }),
                }}
            />
        </Head>
    );
}

export default MetaData;
