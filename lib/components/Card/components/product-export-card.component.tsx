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
        <div className={`export-card`}>
            <div className="card-image">
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
            </div>
            <h3 className='title'>{name}</h3>
            <p>{description}</p>
        </div>
    );
});

export default ProductExportCard;
