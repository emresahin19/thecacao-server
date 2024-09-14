import type { CarouselProps, CategoryProps, ProductProps } from "@asim-ui/interfaces";
import { Carousel } from "@asim-ui/components";
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { defaultColor } from "@asim-ui/constants";
import { getLocalStorageItem, setLocalStorageItem, hexToRgba } from "@asim-ui/utils";
import { useModal } from "@asim-ui/contexts";
import CiViewList from 'lib/assets/icon/svg/CiViewList.svg'
import CiViewBoard from 'lib/assets/icon/svg/CiViewBoard.svg'
import LogoIcon from "lib/components/Logo/components/logo-icon.component";

import ProductCard from "../../Card/components/product-card.component";
import dynamic from "next/dynamic";

const CarouselSkeleton = dynamic(() => import("../../Skeleton/components/carousel.component"), { ssr: false });
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


const CategorySection: React.FC<CategoryProps> = ({ id, name, slug, products, color, index, textColor = defaultColor, viewType = 'carousel' }) => {
    const listTypeStorage = getLocalStorageItem('listTypes') || {};
    const [catType, setCatType] = useState<CarouselProps['viewType']>(listTypeStorage[slug] ?? viewType);
    const [viewed, setViewed] = useState(index < 3);
    const { handleShow } = useModal();
    const [isVisible, setIsVisible] = useState(index < 3);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !viewed) {
                    setIsVisible(true);
                    setViewed(true); // Set 'viewed' to true when the category is visible
                }
            },
            { rootMargin: '100px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, viewed]); // Add 'viewed' to the dependency array

    const handleClick = useCallback((product: ProductProps) => {
        handleShow({
            show: true,
            component: <ProductDetailCard {...product} />,
            route: `menu/${product.fullpath}`
        });
    }, [handleShow]);
    
    const renderContent = () => {
        if (!viewed) {
            return <CarouselSkeleton />;
        }

        const items = products.map((product, i) => {
            const { id, name, slug, description, fullpath, price, category_id, recipe, extra, image_urls, passive, diy, order }: ProductProps = product;
            const isEager = (index === 0 || index === 1) && (i === 0 || i === 1); // First two items load eagerly
            
            return (
                <ProductCard
                    key={id}
                    id={i}
                    name={name}
                    slug={slug}
                    fullpath={fullpath ?? `${slug}`}
                    description={description}
                    price={price}
                    category_id={category_id}
                    recipe={recipe}
                    extra={extra}
                    image_urls={image_urls}
                    passive={passive}
                    diy={diy}
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
            ref={ref}    
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
};

export default CategorySection;
