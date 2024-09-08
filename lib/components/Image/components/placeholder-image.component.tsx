import type { PlaceholderImageProps } from '../image.props';
import React, { useState } from 'react';
import Image from 'next/image';
import { 
    productVariantWidth, 
    productVariantHeight, 
    defaultColor, 
    placeholderProductImage, 
} from '@asim-ui/constants';
import { imageToCdnUrl } from '@asim-ui/utils';

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
    alt, 
    loading, 
    backgroundColor = defaultColor, 
    width = productVariantWidth,
    height = productVariantHeight
}) => {
    const url = imageToCdnUrl({ image: placeholderProductImage, width, height });
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