import type { CarouselProps, CategoryProps, ProductProps } from "@asim-ui/interfaces";
import { Carousel } from "@asim-ui/components";
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { defaultColor } from "@asim-ui/constants";
import { getLocalStorageItem, setLocalStorageItem, hexToRgba } from "@asim-ui/utils";
import { useModal } from "@asim-ui/contexts";

import ProductCard from "../../Card/components/product-card.component";
import dynamic from "next/dynamic";

const CiViewList = dynamic(() => import("react-icons/ci").then((icon) => icon.CiViewList), { ssr: false, loading: () => <svg></svg> });
const CiViewBoard = dynamic(() => import("react-icons/ci").then((icon) => icon.CiViewBoard), { ssr: false, loading: () => <svg></svg> });
const ProductDetailCard = dynamic(() => import("../../Card/components/product-detail-card.component"), { ssr: false });
const LogoIcon = dynamic(() => import("../../Logo/components/logo-icon.component"), { ssr: false, loading: () => <svg></svg> });

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
    const { handleShow } = useModal();
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
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
    }, [ref]);

    const handleClick = (product: ProductProps) => {
        handleShow({
            show: true,
            component: <ProductDetailCard {...product} />,
            route: `menu/${product.fullpath}`
        });
    };
    
    const items = useMemo(() => {
        return products.map((product, i) => {
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
    }, [products, catType, textColor, index, slug]);

    const currentViewType = useMemo(() => viewTypes.find((type) => type.value === catType), [catType]);

    const showAll = useCallback(() => {
        const viewIndex = viewTypes.findIndex((type) => type.value === catType);
        const newType = viewTypes[(viewIndex + 1) % viewTypes.length].value as CarouselProps['viewType'];
        const currentStorage = getLocalStorageItem('listTypes') || {};
        currentStorage[slug] = newType;

        setLocalStorageItem('listTypes', currentStorage);
        setCatType(newType);
    }, [slug, catType]);

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
            <Carousel
                items={items}
                viewType={catType}
                backToStartColor={textColor}
                initialStart={index === 0}
                dots={true}
            />
        </div>
    );
};

export default CategorySection;
