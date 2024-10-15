import type { ImageProps } from '../image.props';
import React from 'react';
import CustomImage from './custom-image.component';
import { productVariantHeight, productVariantWidth } from 'lib/constants';

const ProductImage: React.FC<ImageProps> = ({ image, alt = 'The Cacao', width = productVariantWidth, height = productVariantHeight, type, format, loading = "lazy", backgroundColor, quality = 80 }) => {
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
