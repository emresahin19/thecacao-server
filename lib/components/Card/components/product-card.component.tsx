import type { ProductProps } from '@asim-ui/interfaces';
import React, { memo, useMemo, useCallback } from 'react';
import { ProductImage, ProductDetailCard, Carousel } from '@asim-ui/components';
import { useModal } from '@asim-ui/contexts';
import { productVariantWidth, productVariantHeight, productVariantQuality, defaultColor } from '@asim-ui/constants';
import dynamic from 'next/dynamic';

const PlaceholderImage = dynamic(() => import('../../Image/components/placeholder-image.component'));

const ProductCard: React.FC<ProductProps> = memo(({
    id, 
    name, 
    slug, 
    fullpath = slug, 
    description, 
    price, 
    category_id, 
    recipe, 
    extra, 
    images = [], 
    passive, 
    diy, 
    order, 
    loading,
    textColor = defaultColor,
    listView = false,
}) => {
    const { handleShow } = useModal();

    const imageItems = useMemo(() => images.map((image, index) => (
        <ProductImage 
            key={index}
            image={`${image}`} 
            alt={name} 
            width={productVariantWidth}
            height={productVariantHeight}
            fit={productVariantQuality}
            loading={loading}
        />
    )), [images, name, loading]);

    const handleClick = useCallback(() => {
        handleShow({
            show: true,
            component: <ProductDetailCard {...{ id, name, slug, fullpath, description, price, category_id, recipe, extra, images, passive, diy, order }} />,
            route: `menu/${fullpath}`
        });
    }, [handleShow, id, name, slug, fullpath, description, price, category_id, recipe, extra, images, passive, diy, order]);

    return (
        <div className={`card ${listView ? 'list' : ''}`} onClick={handleClick} role="button" aria-label={`${name} Detay`}>
            <div className="card-image">
                {images.length > 1 ? (
                    <Carousel 
                        items={imageItems} 
                        rowItemsCount={1}
                        dots={true}
                        slideWidth={30}
                        backToStartColor={textColor}
                    />
                ) : (
                    <div className="carousel-item">
                        {imageItems[0] || (
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
