import type { ImageProps } from '../image.props';
import React from 'react';
import CustomImage from './custom-image.component';

const ProductImage: React.FC<ImageProps> = ({ image, alt = 'The Cacao', width, height, type, format, loading = "lazy", backgroundColor, quality = 80 }) => {
    return (
        <CustomImage
            image={image}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            quality={quality}
            type={type}
            format={format}
            {...backgroundColor && { style: { backgroundColor } }}
        />
    );
};

export default ProductImage;
