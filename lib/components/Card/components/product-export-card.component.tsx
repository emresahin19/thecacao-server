import type { ExportCardProps, ProductProps } from '../../../interfaces';
import React, { memo } from 'react';
import { imageToCdnUrl } from 'lib/utils';
import { cdnUrl } from 'lib/constants';

const ProductExportCard: React.FC<ExportCardProps> = memo(({ 
    name, 
    description,
    image,
}) => {
    return (
        <div className={`export-card`}>
            <div className="card-image">
                <img className='image' src={image} />
            </div>
            <h3 className='title'>{name}</h3>
            <p>{description}</p>
        </div>
    );
});

export default ProductExportCard;
