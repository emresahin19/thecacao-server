import type { PlaceholderImageProps } from '../image.props';
import React from 'react';
import { 
    productVariantWidth, 
    productVariantHeight, 
    defaultColor, 
    placeholderProductImage, 
} from 'lib/constants';
import CustomImage from './custom-image.component';

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
    alt, 
    loading, 
    backgroundColor = defaultColor, 
    width = productVariantWidth,
    height = productVariantHeight
}) => {
    return (
        <CustomImage
            image={placeholderProductImage} 
            className="placeholder-image"
            alt={alt} 
            width={width}
            height={height}
            loading={loading}
            {...backgroundColor && { style: { backgroundColor }}}
        />
)};

export default PlaceholderImage;