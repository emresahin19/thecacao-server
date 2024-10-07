import React from 'react';
import LogoIcon from 'lib/components/Logo/components/logo-icon.component';
import { defaultColor } from 'lib/constants';
import { hexToRgba } from 'lib/utils';
import { EditableMenuCardProps } from '../card.props';
import DraggableList from 'lib/components/DragDrop/components/drag-drop.component';
import ProductCard from './product-card.component';
import { ProductProps } from 'lib/interfaces';

const EditableMenuCard = ({ items,  setItems, title = "Items", style}: EditableMenuCardProps) => {
    return (
        <>
            <div className="menu-part">
                <div 
                    className="category-section" 
                    style={{...style && style.backgroundColor && style.opacity && 
                        {
                            backgroundColor: hexToRgba(style.backgroundColor, style.opacity), 
                            color: style.color || defaultColor,
                            fill: style.color || defaultColor,
                        }
                    }}
                >
                    <div className="category-header">
                        <div className="category-title">
                            {<LogoIcon width={20} color={style.color || defaultColor} />}
                            {title}
                        </div>
                    </div>
                    <div className="menu-list">
                        <DraggableList<ProductProps>
                            items={items}
                            setItems={setItems}
                            render={(product: ProductProps, index: number) => (
                                <ProductCard 
                                    key={index}
                                    id={product.id}
                                    name={product.name}
                                    slug={product.slug}
                                    price={product.price}
                                    images={product.images && product.images.length > 0 ? [product.images[0]] : []}
                                    listView={true}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditableMenuCard;