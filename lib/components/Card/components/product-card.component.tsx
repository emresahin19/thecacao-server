import type { ProductProps } from '@asim-ui/interfaces';
import React, { memo, useMemo, useCallback } from 'react';
import { useModal } from '@asim-ui/contexts';
import { productVariantWidth, productVariantHeight, productVariantQuality } from '@asim-ui/constants';
import ProductImage from '../../Image/components/product-image.component';
import PlaceholderImage from '../../Image/components/placeholder-image.component';
import Carousel from '../../Carousel/components/carousel.component';

const ProductCard: React.FC<ProductProps> = memo((product) => {
    const  { 
        id, 
        name, 
        slug, 
        fullpath, 
        description, 
        price, 
        category_id, 
        recipe, 
        extra, 
        image_urls, 
        textColor, 
        passive, 
        diy, 
        order, 
        loading, 
        listView, 
        onClick 
    } = product;
    
    const { handleShow } = useModal();

    const imageItems = image_urls && useMemo(() => image_urls.map((image, index) => (
        <ProductImage 
            key={index}
            image={`${image}`} 
            alt={name} 
            width={productVariantWidth}
            height={productVariantHeight}
            quality={productVariantQuality}
            loading={loading}
        />
    )), [image_urls, name, loading]);

    const handleClick = useCallback(() => {
        onClick && onClick({id, name, slug, fullpath, description, price, category_id, recipe, extra, image_urls, passive, diy, order});
    }, [handleShow, id, name, slug, fullpath, description, price, category_id, recipe, extra, image_urls, passive, diy, order]);

    return (
        <div className={`card ${listView ? 'list' : ''}`} onClick={handleClick} role="button" aria-label={`${name} Detay`}>
            <div className="card-image">
                {imageItems && image_urls.length > 1 ? (
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
