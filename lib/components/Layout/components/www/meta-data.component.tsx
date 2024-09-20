import React from 'react';
import Head from 'next/head';
import {
  appDomain,
  metaDescription,
  metaImage,
  metaImageHeight,
  metaImageWidth,
  metaTitle,
  wwwUrl,
  companyPhone,
  companyName,
  companyFacebook,
  companyInstagram,
  companyStreet,
  companyCity,
  companyZip,
  companyCountry,
  companyOpeningHours,
  companyClosingHours,
  companyGeoLat,
  companyGeoLng,
  metaKeywords,
} from 'lib/constants';

const MetaData: React.FC = () => {
    return (
        <Head>
            <title>{metaTitle}</title>

            <link rel="canonical" href={`${wwwUrl}/menu`} />

            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content="index, follow" />

            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:type" content="image/webp" />
            <meta property="og:image:width" content={metaImageWidth.toString()} />
            <meta property="og:image:height" content={metaImageHeight.toString()} />
            <meta property="og:url" content={wwwUrl} />
            <meta property="og:type" content="website" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image:src" content={metaImage} />
            <meta property="twitter:image:width" content={metaImageWidth.toString()} />
            <meta property="twitter:image:height" content={metaImageHeight.toString()} />
            <meta property="twitter:site" content="@thecacaoco" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "Restaurant",
                        "name": companyName,
                        "description": metaDescription,
                        "image": metaImage,
                        "url": wwwUrl,
                        "telephone": companyPhone,
                        "priceRange": "$$",
                        "servesCuisine": ["Çikolata", "Kahve", "Dünya Mutfağı"],
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": companyStreet,
                            "addressLocality": companyCity,
                            "postalCode": companyZip,
                            "addressCountry": companyCountry,
                        },
                        "openingHoursSpecification": [
                            {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                ],
                                "opens": companyOpeningHours,
                                "closes": companyClosingHours,
                            },
                        ],
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": companyGeoLat,
                            "longitude": companyGeoLng,
                        },
                        "sameAs": [companyFacebook, companyInstagram],
                    }),
                }}
            />
        </Head>
    );
}

export default MetaData;
