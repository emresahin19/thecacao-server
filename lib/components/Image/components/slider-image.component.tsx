import type { ImageProps } from '../image.props';
import React from 'react';
import { sliderVariantHeight, sliderVariantWidth } from "../../../constants";
import CustomImage from './custom-image.component';

const SliderImage: React.FC<ImageProps> = ({image, alt = 'The Cacao', loading = "lazy" }) => {
    return (
        <>
            <CustomImage
                image={image}
                alt={alt} 
                className='image'
                width={sliderVariantWidth}
                height={sliderVariantHeight}
                loading={loading}
            />
        </>
    )
}

export default SliderImage;