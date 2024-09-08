import type { ImageProps } from '../image.props';
import React, { useState } from 'react';
import Image from 'next/image';
import { imageToCdnUrl, imageToCFCdnUrl } from '@asim-ui/utils';

const ProductCFImage: React.FC<ImageProps> = ({ image, alt = 'The Cacao', width, height, loading = "lazy", backgroundColor }) => {
    const url = imageToCFCdnUrl({ image });
    console.log(url)
    const [error, setError] = useState<boolean>(false);

    const handleImageError = (e: any) => {
        setError(true);
    };

    if(error) return (
        <Image
            src={'/images/the-cacao-logo.webp'}
            alt={alt}
            className='image'
            width={width}
            height={height}
            priority={loading === 'eager'}
            loading={loading}
            draggable={false}
            onError={handleImageError}
            style={{
                backgroundColor: 'rgba(var(--primary-rgb), 0.4)'
            }}
        />
    )

    return (
        <>
            <Image
                src={url}
                alt={alt}
                className='image'
                width={width}
                height={height}
                priority={loading === 'eager'}
                loading={loading}
                draggable={false}
                onError={handleImageError}
                {...backgroundColor && { style: { backgroundColor } }}
            />
        </>
    )
}

export default ProductCFImage;