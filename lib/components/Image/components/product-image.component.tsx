import type { ImageProps } from '../image.props';
import React, { useState } from 'react';
import Image from 'next/image';

const ProductImage: React.FC<ImageProps> = ({ src, alt = 'The Cacao', width, height, fit, loading = "lazy", backgroundColor }) => {
    const productVariants = `w=${width},h=${height},fit=${fit}`;
    const url = `${src}${productVariants}`;

    const [error, setError] = useState<boolean>(false);

    const handleImageError = (e: any) => {
        setError(true);
    };

    if(error) return (
        <Image
            src={'/the-cacao-logo.webp'}
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

export default ProductImage;