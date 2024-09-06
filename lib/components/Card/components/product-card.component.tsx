import type { ProductProps } from '@asim-ui/interfaces';
import React, { memo, useMemo } from 'react';
import { ProductImage, Skeleton, ProductDetailCard, Carousel } from '@asim-ui/components';
import { useModal, useVariable } from '@asim-ui/contexts';
import { productVariantWidth, productVariantHeight, productVariantQuality, defaultColor } from '@asim-ui/constants';
import dynamic from 'next/dynamic';

const PlaceholderImage = dynamic(() => import('../../Image/components/placeholder-image.component'));

const ProductCard: React.FC<ProductProps> = ({ 
    id, 
    name, 
    slug, 
    fullpath = slug, 
    description, 
    price, 
    category_id, 
    recipe, 
    extra, 
    images, 
    passive, 
    diy, 
    order, 
    loading,
    textColor = defaultColor,
    listView = false,
}) => {
    const { handleShow } = useModal();
    const { loaded } = useVariable();
    
    const imgItems = useMemo(() => images.map((image) => {
        return slug === 'placeholder-slug' ? 
            <Skeleton 
                width={`calc(100% - 16px)`} 
                style={{
                    aspectRatio: (productVariantWidth / productVariantHeight),
                    borderRadius: 6,
                    marginTop: 8,
                    marginBottom: 8
                }}
            />
            :
            <ProductImage 
                key={image}
                src={`${image}`} 
                alt={name} 
                width={productVariantWidth}
                height={productVariantHeight}
                fit={productVariantQuality}
                loading={loading}
            />
        }
    ), [images, name, productVariantWidth, productVariantHeight, productVariantQuality, loading]);

    const handleClick = () => {
        return handleShow({
            show: true,
            component: <ProductDetailCard {...{ id, name, slug, fullpath, description, price, category_id, recipe, extra, images, passive, diy, order }} />,
            route: `menu/${fullpath}`
        });
    };

    return (
        <div className={`card ${listView ? 'list' : ''}`} onClick={handleClick} role="button" aria-label={`${name} Detay`}>
            <div className="card-image">
                {!loaded && (
                    <>
                        <Skeleton 
                            width={`calc(100% - 16px)`} 
                            style={{
                                aspectRatio: (productVariantWidth / productVariantHeight),
                                borderRadius: 6,
                                marginTop: 8,
                                marginBottom: 8
                            }}
                        />
                        <div className="counter">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </>
                )}
                
                {loaded && imgItems.length > 1 && (
                    listView ? (
                        <div className="carousel-item">
                            {imgItems[0]}
                        </div>
                    ) : (
                        <Carousel 
                            items={imgItems} 
                            rowItemsCount={1}
                            dots={true}
                            slideWidth={30}
                            backToStartColor={textColor}
                        />
                    )
                )}

                {loaded && imgItems.length === 1 && (
                    <div className="carousel-item">
                        {imgItems[0]}
                        <div className='counter' />
                    </div>
                )}
                
                {loaded && imgItems.length === 0 && (
                    <div className="carousel-item">
                        <PlaceholderImage 
                            alt={name} 
                            loading={loading}
                        />
                        <div className='counter' />
                    </div>
                )}
            </div>
            <div className='content'>
                {!loaded ? (
                    <>
                        <div className="title">
                            <Skeleton width={'calc(100% - 32px)'} height={13} />
                        </div>
                        <Skeleton 
                            className="price"
                            borderRadius={28}
                            style={{
                                width: '50%',
                                height: 16,
                            }}
                        />
                    </>
                ) : (
                    <>
                        <h3 className='title'>{name}</h3>
                        <p className='price'>{price}₺</p>
                    </>
                )}
            </div>
            
        </div>
    );
};

export default memo(ProductCard);
