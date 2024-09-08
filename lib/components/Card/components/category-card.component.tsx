"use client";
import type { CarouselProps, CategoryProps, ProductProps } from "@asim-ui/interfaces";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Carousel, ProductCard } from "@asim-ui/components";
import dynamic from "next/dynamic";
import { defaultColor } from "@asim-ui/constants";
import { getLocalStorageItem, hexToRgba, setLocalStorageItem } from "@asim-ui/utils";
import { CiViewBoard, CiViewList } from "react-icons/ci";

const LogoIcon = dynamic(() => import('../../Logo/components/logo-icon.component'), { ssr: false });

const viewTypes = [
    {
        value: 'carousel',
        title: 'Liste Görünümü',
        icon: <CiViewList />,
    },
    {
        value: 'list',
        title: 'Standart Görünüme Dön',
        icon: <CiViewBoard />,
    },
];

const CategorySection: React.FC<CategoryProps> = ({ id, name, slug, products, color, index, textColor = defaultColor, viewType = 'carousel' }) => {
    const listTypeStorage = getLocalStorageItem('listTypes') || {};
    const [catType, setCatType] = useState<CarouselProps['viewType']>(listTypeStorage[slug] ?? viewType);
    const categoryRef = useRef<HTMLDivElement>(null);
    const categorySlug = slug;

    const items = React.useMemo(() => products.map((product, i) => {
        const { id, name, slug, description, fullpath, price, category_id, recipe, extra, images, passive, diy, order }: ProductProps = product;
        const isEager = (index === 0 || index === 1) && (i === 0 || i === 1);

        return (
            <ProductCard
                key={id}
                id={i}
                name={name}
                slug={slug}
                fullpath={fullpath ?? `${categorySlug}/${slug}`}
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
    }), [products, categorySlug, index, catType, slug]);

    const showAll = useCallback((e: any) => {
        const viewIndex = viewTypes.findIndex((type) => type.value === catType);
        const newType = viewTypes[(viewIndex + 1) % viewTypes.length].value as CarouselProps['viewType'];
        const currentStorage = getLocalStorageItem('listTypes') || {};
        currentStorage[slug] = newType

        setLocalStorageItem('listTypes', currentStorage)
        setCatType(newType);
    }, [slug, catType]);

    useEffect(() => {
        const listType = listTypeStorage[slug] || viewType
        setCatType(listType)
    }, [])

    return (
        <div ref={categoryRef} id={`category-${id}`} className="category-section" style={{ background: color ? hexToRgba(color, 0.25) : '' }}>
            <div className="category-header">
                <div className="category-title" style={{color: textColor}}>
                    <LogoIcon width={20} color={textColor} />
                    {name}
                </div>
                <div
                    className="category-title"
                    role="button"
                    onClick={showAll}
                    aria-label={viewTypes.find((type) => type.value === catType)?.title || 'Tümünü Göster'}
                    style={{color: textColor}}
                >
                    {viewTypes.find((type) => type.value === catType)?.icon}
                    {viewTypes.find((type) => type.value === catType)?.title || ''}
                </div>
            </div>
            <Carousel
                items={items}
                viewType={catType}
                backToStartColor={textColor}
                initialStart={index === 0}
                dots={true}
                // columnItemsCount={hasImage ? 1 : 3}
            />
        </div>
    );
};

export default CategorySection;
