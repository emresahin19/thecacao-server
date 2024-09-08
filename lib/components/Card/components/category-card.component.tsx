"use client";
import type { CarouselProps, CategoryProps, ProductProps } from "@asim-ui/interfaces";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Carousel, ProductCard } from "@asim-ui/components";
import dynamic from "next/dynamic";
import { defaultColor } from "@asim-ui/constants";
import { getLocalStorageItem, setLocalStorageItem, hexToRgba } from "@asim-ui/utils";
import { CiViewBoard, CiViewList } from "react-icons/ci";
import { useLoading } from "@asim-ui/contexts";

const LogoIcon = dynamic(() => import('../../Logo/components/logo-icon.component'), { ssr: true });

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
    const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>(products.slice(0, 2));

    const { domContentLoaded } = useLoading();

    useEffect(() => {
        if (domContentLoaded) {
            setVisibleProducts(products);
        }
    }, [domContentLoaded]);

    const items = useMemo(() => {
        return visibleProducts.map((product, i) => {
            const { id, name, slug, description, fullpath, price, category_id, recipe, extra, images, passive, diy, order }: ProductProps = product;
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
                    images={images}
                    passive={passive}
                    diy={diy}
                    order={order}
                    loading={isEager ? 'eager' : 'lazy'}
                    textColor={textColor}
                    listView={catType === 'list'}
                />
            );
        });
    }, [visibleProducts, catType, textColor, index, slug]);

    // Use useMemo to cache the current view type details
    const currentViewType = useMemo(() => viewTypes.find((type) => type.value === catType), [catType]);

    // Toggle between carousel and list view, store choice in local storage
    const showAll = useCallback(() => {
        const viewIndex = viewTypes.findIndex((type) => type.value === catType);
        const newType = viewTypes[(viewIndex + 1) % viewTypes.length].value as CarouselProps['viewType'];
        const currentStorage = getLocalStorageItem('listTypes') || {};
        currentStorage[slug] = newType;

        setLocalStorageItem('listTypes', currentStorage);
        setCatType(newType);
    }, [slug, catType]);

    return (
        <div id={`category-${id}`} className="category-section" style={{ background: color ? hexToRgba(color, 0.25) : '' }}>
            <div className="category-header">
                <div className="category-title" style={{ color: textColor }}>
                    <LogoIcon width={20} color={textColor} />
                    {name}
                </div>
                <div
                    className="category-title"
                    role="button"
                    onClick={showAll}
                    aria-label={currentViewType?.title || 'Show All'}
                    style={{ color: textColor }}
                >
                    {currentViewType?.icon}
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
