import type { CarouselProps, CategoryProps, ProductProps } from "../../../interfaces";
import Carousel from "../../Carousel/components/carousel.component";
import React, { useState, useCallback, useEffect, useMemo, forwardRef } from "react";
import { defaultColor } from "../../../constants";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/localStorage";
import { useModal } from "../../../contexts";
import CiViewList from 'lib/assets/icon/svg/CiViewList.svg'
import CiViewBoard from 'lib/assets/icon/svg/CiViewBoard.svg'
import LogoIcon from "../../Logo/components/logo-icon.component";

import ProductCard from "../../Card/components/product-card.component";
import dynamic from "next/dynamic";
import { hexToRgba } from "lib/utils";


// const CarouselSkeleton = dynamic(() => import("../../Skeleton/components/carousel.component"), { ssr: false });
const ProductDetailCard = dynamic(() => import("../../Card/components/product-detail-card.component"), { ssr: false });

const viewTypes = [
    {
        value: 'carousel',
        title: 'Liste Görünümü',
        icon: <CiViewList />,
    },
    {
        value: 'list',
        title: 'Standart Görünüm',
        icon: <CiViewBoard />,
    },
];

const CategorySection = forwardRef<HTMLDivElement, CategoryProps>((props, ref) => {
    const {
        id,
        name,
        slug,
        products,
        color,
        index,
        textColor,
        viewType = 'carousel',
        isVisible
    } = props;

    const [catType, setCatType] = useState<CarouselProps['viewType']>(viewType);
    const { handleShow } = useModal();
    
    useEffect(() => {
        const listTypeStorage = getLocalStorageItem('listTypes') || {};
        if (listTypeStorage[slug]) {
            setCatType(listTypeStorage[slug]);
        }
    }, [slug]);

    const handleClick = useCallback((product: ProductProps) => {
        handleShow({
            show: true,
            component: <ProductDetailCard {...product} />,
            route: `menu/${product.fullpath}`
        });
    }, [handleShow]);
    
    const renderContent = () => {
        if (!isVisible) {
            return null;
        }

        const items = products.map((product, i) => {
            const { id, name, slug, description, fullpath, price, extra, images, order }: ProductProps = product;
            const isEager = (index === 0 || index === 1) && (i === 0 || i === 1); // İlk iki öğe eager yüklenir

            return (
                <ProductCard
                    key={id}
                    id={i}
                    name={name}
                    slug={slug}
                    fullpath={fullpath ?? `${slug}`}
                    description={description}
                    price={price}
                    extra={extra}
                    images={images}
                    order={order}
                    loading={isEager ? 'eager' : 'lazy'}
                    textColor={textColor}
                    listView={catType === 'list'}
                    onClick={handleClick}
                />
            );
        });

        return (
            <Carousel
                items={items}
                viewType={catType}
                backToStartColor={textColor}
                initialStart={index === 0}
                dots={true}
            />
        );
    };

    const currentViewType = useMemo(() => viewTypes.find((type) => type.value === catType), [catType]);

    const showAll = useCallback(() => {
        const viewIndex = viewTypes.findIndex((type) => type.value === catType);
        const newType = viewTypes[(viewIndex + 1) % viewTypes.length].value as CarouselProps['viewType'];
        const currentStorage = getLocalStorageItem('listTypes') || {};
        currentStorage[slug] = newType;

        setLocalStorageItem('listTypes', currentStorage);
        setCatType(newType);
    }, [slug, catType, isVisible]);

    return (
        <div 
            id={`category-${id}`} 
            className="category-section" 
            style={{ background: color ? hexToRgba(color, 0.25) : '' }}
            ref={ref as React.RefObject<HTMLDivElement>}
            data-id={id} 
        >
            <div className="category-header">
                <div className="category-title" style={{ color: textColor }}>
                    {isVisible && <LogoIcon width={20} color={textColor} />}
                    {name}
                </div>
                <div
                    className="category-title"
                    role="button"
                    onClick={showAll}
                    aria-label={currentViewType?.title || 'Show All'}
                    style={{ color: textColor }}
                >
                    {isVisible && currentViewType?.icon}
                    {currentViewType?.title || ''}
                </div>
            </div>
            {renderContent()}
        </div>
    );
});

export default CategorySection;
