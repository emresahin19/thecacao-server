import type { CarouselProps, CategoryProps, ProductProps } from "../../../interfaces";
import Carousel from "../../Carousel/components/carousel.component";
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { defaultColor } from "../../../constants";
import { getLocalStorageItem, setLocalStorageItem } from "../../../utils/localStorage";
import CiViewList from 'lib/assets/icon/svg/CiViewList.svg'
import CiViewBoard from 'lib/assets/icon/svg/CiViewBoard.svg'
import LogoIcon from "../../Logo/components/logo-icon.component";
import ProductCard from "../../Card/components/product-card.component";
import { hexToRgba } from "lib/utils";

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

const CategorySection: React.FC<CategoryProps> = ({ id, name, slug, description, style, products, index, viewType = 'carousel', onProductClick }) => {
    const [catType, setCatType] = useState<CarouselProps['viewType']>(style?.viewType || viewType);
    // const [viewed, setViewed] = useState(index < 3);
    // const [isVisible, setIsVisible] = useState(index < 3);
    const ref = useRef<HTMLDivElement>(null);
    const category_slug = slug;

    useEffect(() => {
        const listTypeStorage = getLocalStorageItem('listTypes') || {};
        if (listTypeStorage[slug]) {
            setCatType(listTypeStorage[slug]);
        }
    }, [slug]);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting && !viewed) {
    //                 setIsVisible(true);
    //                 setViewed(true); 
    //             }
    //         },
    //         { rootMargin: '150px' }
    //     );

    //     if (ref.current) {
    //         observer.observe(ref.current);
    //     }

    //     return () => {
    //         if (ref.current) {
    //             observer.unobserve(ref.current);
    //         }
    //     };
    // }, [ref, viewed]);

    const handleProductClick = useCallback(({ productSlug }: { productSlug: string }) => {
        onProductClick && onProductClick({ productSlug });
    }, [onProductClick]);

    const renderContent = () => {
        // if (!viewed) {
        //     return <></>;
        // }

        const items = products.map((product, i) => {
            const { id, name, slug, description, price, category_id, recipe, extra, images, order }: ProductProps = product;
            const isEager = (index === 0 || index === 1) && (i === 0 || i === 1); // First two items load eagerly
            const fullpath = `${category_slug}/${slug}`;

            return (
                <ProductCard
                    key={id}
                    id={id}
                    name={name}
                    slug={slug}
                    category_id={category_id}
                    fullpath={fullpath}
                    description={description}
                    price={price}
                    extra={extra}
                    images={images}
                    order={order}
                    loading={isEager ? 'eager' : 'lazy'}
                    textColor={style.color || defaultColor}
                    listView={catType === 'list'}
                    onClick={(e) => handleProductClick({ productSlug: slug })}
                />
            );
        });

        return (
            <Carousel
                items={items}
                viewType={catType}
                backToStartColor={style.color || defaultColor}
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
    }, [slug, catType]);

    return (
        <div
            id={`category-${id}`}
            className="category-section"
            style={{
                ...style && style.backgroundColor && style.opacity &&
                {
                    backgroundColor: hexToRgba(style.backgroundColor, style.opacity),
                    color: style.color || defaultColor,
                    fill: style.color || defaultColor,
                }
            }}
            ref={ref}
        >
            <div className="category-header">
                <div className="category-title">
                    {<LogoIcon width={20} color={style.color || defaultColor} />}
                    {name}
                </div>
                <div
                    className="category-title"
                    role="button"
                    onClick={showAll}
                    aria-label={currentViewType?.title || 'Show All'}
                >
                    {currentViewType?.icon}
                    {currentViewType?.title || ''}
                </div>
                {description && (
                    <div className="category-description">
                        {description}
                    </div>
                )}
            </div>
            {renderContent()}
        </div>
    );
};

export default CategorySection;
