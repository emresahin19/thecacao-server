import React, { useEffect, useState } from "react";
import { MenuProps } from "./menu.props";
import { ProductProps } from "@asim-ui/interfaces";
import { sleep } from "@asim-ui/utils";
import { useLoading, useModal } from "@asim-ui/contexts";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@asim-ui/store";
import { CategorySection } from "@asim-ui/components";

const LazyCategorySection = dynamic(() => import('../../components/Card/components/category-card.component'), { ssr: false });
const ProductDetailCard = dynamic(() => import('../../components/Card/components/product-detail-card.component'), { ssr: false });
const initialObjectCount = 3;

const Menu: React.FC<MenuProps> = () => {
    const router = useRouter();
    const { handleShow } = useModal();
    const { domContentLoaded } = useLoading();
    const { data, selectedProduct } = useSelector((state: RootState) => state.menu);
    
    useEffect(() => {
        const onProductDetails = async (product: ProductProps) => {
            if (!product) return;
    
            await sleep(500);
            handleShow({
                show: true,
                component: <ProductDetailCard {...product} />,
                route: `/menu/${router.query.categorySlug}/${router.query.productSlug}`
            });
        };
        if (selectedProduct) 
            onProductDetails(selectedProduct);
    }, [selectedProduct]);

    return (
        <div className="menu-container">
            {data.slice(0, initialObjectCount).map((category, i) => (
                <CategorySection
                    key={category.id}
                    id={category.id}
                    index={i}
                    order={category.order}
                    slug={category.slug}
                    name={category.name}
                    products={category.products}
                    color={category.color}
                    textColor={category.textColor}
                    isActive={router.query.categorySlug === category.slug}
                />
            ))}

            {/* Lazy load additional categories only after client-side load */}
            {domContentLoaded && data.slice(initialObjectCount).map((category, i) => (
                <LazyCategorySection 
                    key={category.id}
                    id={category.id}
                    index={i + initialObjectCount}
                    order={category.order}
                    slug={category.slug}
                    name={category.name}
                    products={category.products}
                    color={category.color}
                    textColor={category.textColor}
                    isActive={router.query.categorySlug === category.slug}
                />
            ))}
        </div>
    );
};

export default Menu;
