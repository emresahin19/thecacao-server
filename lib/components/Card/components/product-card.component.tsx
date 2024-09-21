import type { ProductProps } from '../../../interfaces';
import React, { memo, useMemo } from 'react';
import { productVariantWidth, productVariantHeight, productVariantQuality } from '../../../constants';
import ProductImage from '../../Image/components/product-image.component';
import PlaceholderImage from '../../Image/components/placeholder-image.component';
import Carousel from '../../Carousel/components/carousel.component';

const ProductCard: React.FC<ProductProps> = memo((product) => {
    const  { 
        id,
        category_id,
        name, 
        price, 
        images,
        textColor, 
        loading, 
        listView, 
        order,
        onClick, 
    } = product;
    

    const imageItems = images && useMemo(() => images.map((image, index) => (
        <ProductImage 
            key={index}
            image={`${image.filename}`} 
            alt={name} 
            width={productVariantWidth}
            height={productVariantHeight}
            type='product'
            quality={productVariantQuality}
            loading={loading === 'eager' && index === 0 ? 'eager' : 'lazy'}
        />
    )), [images, name, loading]);

    return (
        <div className={`card ${listView ? 'list' : ''}`} onClick={onClick} role="button" aria-label={`${name} Detay`}>
            <div className="card-image">
                {imageItems && imageItems.length > 1 ? (
                    <Carousel 
                        items={imageItems} 
                        rowItemsCount={1}
                        dots={true}
                        slideWidth={30}
                        backToStartColor={textColor}
                    />
                ) : (
                    <div className="carousel-item">
                        {imageItems && imageItems[0] || (
                            <PlaceholderImage 
                                alt={name} 
                                loading={loading}
                                backgroundColor='rgba(var(--primary-rgb), 0.4)'
                            />
                        )}
                        <div className='counter' />
                    </div>
                )}
            </div>
            <div className='content'>
                <h3 className='title'>{name}</h3>
                <p className='price'>{price}₺</p>
            </div>
        </div>
    );
});

export default ProductCard;
