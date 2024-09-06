import type { PlaceholderImageProps } from '../image.props';
import React, { useState } from 'react';
import Image from 'next/image';
import { 
    productVariantWidth, 
    productVariantHeight, 
    defaultColor, 
    productVariantQuality, 
    placeholderImage, 
} from '@asim-ui/constants';

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
    alt, 
    loading, 
    backgroundColor = defaultColor, 
    width = productVariantWidth,
    height = productVariantHeight,
    fit = productVariantQuality
}) => {
    const productVariants = `w=${width},h=${height},fit=${fit}`;
    const url = `${placeholderImage}${productVariants}`;

    const [imageSrc, setImageSrc] = useState<string>(url); 

    const handleImageError = (e: any) => {
        setImageSrc('/the-cacao-logo.webp');
    };

    return (
        <Image
            src={imageSrc} 
            className="placeholder-image"
            alt={alt} 
            width={width}
            height={height}
            loading={loading}
            priority={loading === 'eager'}
            onError={handleImageError}
            draggable={false}
            style={{...backgroundColor && { backgroundColor }}}
        />
        // </div>
)};

export default PlaceholderImage;