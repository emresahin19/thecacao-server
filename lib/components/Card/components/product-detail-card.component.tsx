import { ProductProps } from '@asim-ui/interfaces';
import React, { memo } from 'react';
import { Carousel, PlaceholderImage, ProductImage } from '@asim-ui/components';
import { productDetailVariantWidth, productDetailVariantHeight, productDetailVariantQuality, extraImageWidth, extraImageHeight, extraImageFit } from '@asim-ui/constants';
import { useVariable } from '@asim-ui/contexts';

const ProductDetail: React.FC<ProductProps> = ({ id, name, slug, fullpath = '', description, price, category_id, recipe, extra, images, passive, diy, order }) => {
    const { loaded } = useVariable();

    const imgItems = images.map((image) => 
        <ProductImage 
            src={`${image}`} 
            alt={name} 
            width={productDetailVariantWidth}
            height={productDetailVariantHeight}
            fit={productDetailVariantQuality}
            loading='eager'
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
                            {item.image && item.image.url && <img src={`${item.image.url}w=${extraImageWidth},h=${extraImageHeight},fit=${extraImageFit}`} alt="" />}
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
                {loaded && imgItems.length > 1 && (
                    <Carousel 
                        items={imgItems} 
                        rowItemsCount={1}
                        dots={true}
                        // initialStart={true}
                    />
                )}

                {loaded && imgItems.length === 1 && (
                    <div className="carousel-item">
                        {imgItems[0]}
                    </div>
                )}

                {loaded && imgItems.length === 0 && (
                    <PlaceholderImage 
                        alt={name} 
                        backgroundColor='transparent'
                        width={productDetailVariantWidth}
                        height={productDetailVariantHeight}
                    />
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