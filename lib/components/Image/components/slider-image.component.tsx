import type { ImageProps } from '../image.props';
import React from 'react';
import Image from 'next/image';
import { sliderVariantHeight, sliderVariantWidth, sliderVariantFit } from "@asim-ui/constants";
import { isValidUrl } from '@asim-ui/utils';

const SliderImage: React.FC<ImageProps> = ({src, alt = 'The Cacao', loading = "lazy" }) => {
    const sliderVariant = `w=${sliderVariantWidth},h=${sliderVariantHeight},fit=${sliderVariantFit}`;
    const url = `${src}${sliderVariant}`;
    
    if (!isValidUrl(src)) {
        return null;
    }

    return (
        <>
            <Image
                src={url}
                alt={alt} 
                className='image'
                width={sliderVariantWidth}
                height={sliderVariantHeight}
                priority={loading === 'eager'}
                draggable={false}
                loading={loading}
            />
        </>

    )
}

export default SliderImage;