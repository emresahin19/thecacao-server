import type { ProductProps } from '../../../interfaces';
import React, { memo } from 'react';
import ProductImage from '../../Image/components/product-image.component';
import PlaceholderImage from '../../Image/components/placeholder-image.component';

const ProductExportCard: React.FC<ProductProps> = memo((product) => {
    const  { 
        name, 
        description,
        images,
    } = product;
    
    return (
        <div className={`card list export-card`}>
            <div className="card-image">
                <div className="carousel-item">
                    {images && images[0] && (
                        <ProductImage 
                            image={`${images[0].filename}`} 
                            alt={name} 
                            type='product'
                        />
                    ) || (
                        <PlaceholderImage 
                            alt={name} 
                            backgroundColor='rgba(var(--primary-rgb), 0.4)'
                        />
                    )}
                    <div className='counter' />
                </div>
            </div>
            <div className='content'>
                <h3 className='title'>{name}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
});

export default ProductExportCard;
