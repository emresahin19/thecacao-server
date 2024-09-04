import type { ImageProps } from '../image.props';
import React from 'react';
import Image from 'next/image';

const ProductImage: React.FC<ImageProps> = ({src, alt = 'The Cacao', width, height, fit, loading = "lazy", backgroundColor }) => {
    const productVariants = `w=${width},h=${height},fit=${fit}`;
    const url = `${src}${productVariants}`;
    
    const onError = (e: any) => {
        e.target.src = '/the-cacao-logo.png';
    }

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
                onError={onError}
                {...backgroundColor && { style: { backgroundColor } }}
            />
        </>

    )
}

export default ProductImage;