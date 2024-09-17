import type { ImageProps } from '../image.props';
import React, { useState } from 'react';
import Head from 'next/head';
import { imageToCdnSet, imageToCdnUrl } from '../../../utils/helpers';
import { cdnUrl, placeholderProductImage } from '../../../constants';
import Image from 'next/image';

const CustomImage: React.FC<ImageProps> = ({ image, alt = 'The Cacao', width, type, height, loading = "lazy", backgroundColor, format, quality = 80, style }) => {
    const [error, setError] = useState<boolean>(false);
    // const { srcSet, sizes, src } = imageToCdnSet({ image, width, height, type, format, quality });
    const src = imageToCdnUrl({ image, width, height, type, format, quality });
    // const isLazy = loading === 'lazy';
    console.log(src)
    const handleImageError = () => {
        setError(true);
    };

    if (error) {
        return (
            <Image
                src={`${cdnUrl}/images/${placeholderProductImage}`}
                alt={alt}
                className='image'
                width={width}
                height={height}
                loading={loading}
                draggable={false}
                onError={handleImageError}
                style={{
                    backgroundColor: 'rgba(var(--primary-rgb), 0.4)',
                }}
            />
        );
    }

    return (
        <>
            <Image
                src={src}
                alt={alt}
                className='image'
                width={width}
                height={height}
                priority={loading === 'eager'}
                loading={loading}
                draggable={false}
                {...backgroundColor && { style: { backgroundColor } }}
            />
            {/* {!isLazy && (
                <Head>
                    <link 
                        rel="preload" 
                        as="image" 
                        imageSrcSet={srcSet} 
                    />
                </Head>
            )}
            <img
                src={src}
                alt={alt}
                className='image'
                width={width}
                height={height}
                srcSet={srcSet} 
                sizes={sizes}
                onError={handleImageError}
                loading={loading}
                decoding={isLazy ? 'async' : 'sync'}
                draggable={false}
                {...(!isLazy && { fetchpriority: 'high' })}
                {...style && { style }}
            /> */}
        </>
    );
};

export default CustomImage;
