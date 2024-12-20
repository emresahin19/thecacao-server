import React from 'react';
import LogoIcon from 'lib/components/Logo/components/logo-icon.component';
import { defaultColor } from 'lib/constants';
import { hexToRgba } from 'lib/utils';
import { CardStyleProps, EditableMenuCardProps } from '../card.props';
import ScrollableDraggableList from 'lib/components/DragDrop/components/scrollable-drag-drop.component';
import ProductCard from './product-card.component';
import { ProductProps } from 'lib/interfaces';

const defaultStyle: CardStyleProps = {
    backgroundColor: defaultColor,
    color: '#fff',
    opacity: 0.2,
};

const EditableMenuCard = ({ items,  setItems, title = "Items", style = defaultStyle}: EditableMenuCardProps) => {
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
                            {<LogoIcon width={20} color={style.color ?? defaultColor} />}
                            {title}
                        </div>
                    </div>
                    <div className="menu-list">
                        <ScrollableDraggableList<ProductProps>
                            items={items}
                            setItems={setItems}
                            property='vertical'
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