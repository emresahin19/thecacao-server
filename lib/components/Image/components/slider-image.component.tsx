import type { ImageProps } from '../image.props';
import React from 'react';
import Image from 'next/image';
import { sliderVariantHeight, sliderVariantWidth } from "@asim-ui/constants";

const SliderImage: React.FC<ImageProps> = ({image, alt = 'The Cacao', loading = "lazy" }) => {
    return (
        <>
            <Image
                src={image}
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