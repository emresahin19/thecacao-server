import { ExtraDataProps, ProductProps } from 'lib/interfaces';
import React, { memo, useState } from 'react';
import Carousel from "lib/components/Carousel/components/carousel.component";
import ProductImage from '../../Image/components/product-image.component';
import PlaceholderImage from '../../Image/components/placeholder-image.component';

import { productDetailVariantWidth, productDetailVariantHeight, productDetailVariantQuality } from 'lib/constants';

const ProductDetail: React.FC<ProductProps> = ({ name, description, price, extra, extras, images }) => {
    const imageItems = images && images.map((image) => 
        <ProductImage 
            key={image.id}
            image={`${image.filename}`} 
            alt={name} 
            width={productDetailVariantWidth}
            height={productDetailVariantHeight}
            quality={productDetailVariantQuality}
            type='product-detail'
            loading='lazy'
        />
    );
    
    const ExtraItems: React.FC<ExtraDataProps> = ({ name, description, image, extras }: ExtraDataProps) => {
        if (!extras || extras.length === 0) return null;

        // Seçili öğeleri tutmak için durum
        const [selectedItems, setSelectedItems] = useState<number[]>([]);

        // Dinamik seçilebilecek maksimum öğe sayısı
        const maxSelectableItems = 3; // Bu değeri ihtiyacınıza göre değiştirebilirsiniz

        const handleItemClick = (itemId: number) => {
            setSelectedItems(prevSelected => {
                if (prevSelected.includes(itemId)) {
                    // Öğeyi kaldır
                    return prevSelected.filter(id => id !== itemId);
                } else {
                    if (prevSelected.length < maxSelectableItems) {
                        // Öğeyi ekle
                        return [...prevSelected, itemId];
                    } else {
                        // Maksimum seçime ulaşıldığında işlem yapma
                        return prevSelected;
                    }
                }
            });
        };

        return (
            <div className='extra'>
                <div className="extra-header">
                    <span className="extra-t">Ekstra {name} Seç <span>{name === 'Belçika Çikolatası' ? '(50cl)' : ''}</span></span>
                    <p>
                        {description}
                    </p>
                </div>
                <div className="extra-items">
                    {extras.map((item, index) => {
                        const isSelected = selectedItems.includes(item.id);
                        return (
                            <div
                                key={index}
                                className={`extra-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item.id)}
                            >
                                {item && item.image  
                                    ? <ProductImage
                                        image={item.image.filename}
                                        alt={item.name}
                                        width={productDetailVariantWidth}
                                        height={productDetailVariantHeight}
                                        quality={productDetailVariantQuality}
                                        type='extra'
                                        loading='lazy'
                                    />
                                    : <PlaceholderImage 
                                        alt={item.name} 
                                        backgroundColor='transparent'
                                        width={productDetailVariantWidth}
                                        height={productDetailVariantHeight}
                                    />
                                }
                                <div className="extra-item-content">
                                    <span className="extra-item-title">{item.name}</span>
                                    <span className="extra-item-price">{item.price}₺</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Seçilen öğelerin ID'lerini göster */}
                {selectedItems.length > 0 && (
                    <div className="selected-items">
                        Seçilen öğelerin ID'leri: {selectedItems.join(', ')}
                    </div>
                )}
            </div>
        );
    };

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
                {extras && extras.length > 0 && extras.map((extra) => (
                    <ExtraItems key={extra.id} {...extra} />
                ))}
            </div>
        </div>
    );
};

export default memo(ProductDetail);