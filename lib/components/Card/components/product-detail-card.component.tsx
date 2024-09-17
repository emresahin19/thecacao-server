import { ProductProps } from 'lib/interfaces';
import React, { memo } from 'react';
import Carousel from "lib/components/Carousel/components/carousel.component";
import ProductImage from '../../Image/components/product-image.component';
import PlaceholderImage from '../../Image/components/placeholder-image.component';

import { productDetailVariantWidth, productDetailVariantHeight, productDetailVariantQuality } from 'lib/constants';

const ProductDetail: React.FC<ProductProps> = ({ name, description, price, extra, images }) => {
    const imageItems = images && images.map((image) => 
        <ProductImage 
            key={image.id}
            image={`${image.filename}`} 
            alt={name} 
            width={productDetailVariantWidth}
            height={productDetailVariantHeight}
            quality={productDetailVariantQuality}
            loading='lazy'
        />
    );
    
    const ExtraItems: React.FC = () => {
        if(!extra) return null;

        const categoryName = extra[0].category_name;
        return (
            
            <div className='extra'>
                <div className="extra-header">
                    <span className="extra-t">Ekstra {categoryName} Seç <span>{categoryName === 'Belçika Çikolatası' ? '(50cl)' : ''}</span></span>
                    <p>
                        Dilerseniz, {name} ile ekstra {categoryName} tercih edebilirsiniz.
                    </p>
                </div>
                <div className="extra-items">
                    {extra.map((item, index) => (
                            <div key={index} className="extra-item">
                                {item && item.image && <img src={`${item.image}`} alt="" />}
                                <div className="extra-item-content">
                                    <span className="extra-item-title">{item.name}</span>
                                    <span className="extra-item-price">{item.price}₺</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className='detail-card'>
            <div className="image">
                {imageItems && imageItems.length > 1 ? (
                    <Carousel 
                        items={imageItems} 
                        rowItemsCount={1}
                        dots={true}
                    />
                ) : (
                    <div className="carousel-item">
                        {imageItems && imageItems[0] || (
                            <PlaceholderImage 
                                alt={name} 
                                backgroundColor='transparent'
                                width={productDetailVariantWidth}
                                height={productDetailVariantHeight}
                            />
                        )}
                        <div className='counter' />
                    </div>
                )}

            </div>
            <div className='content'>
                <h3 className='title'>{name}</h3>
                <p className='price'>
                    {price}₺
                </p>
                {description &&
                    <p className="description">
                        {description}
                    </p>
                }
                {extra && extra.length > 0 && extra[0].name && 
                    <ExtraItems />
                }
            </div>
        </div>
    );
};

export default memo(ProductDetail);