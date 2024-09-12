import React from "react";
import { CategoryCarouselItemProps, MenuProps } from "@asim-ui/interfaces";

import CategorySection from '../../components/Card/components/category-card.component';
// import dynamic from "next/dynamic";
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';
import dynamic from "next/dynamic";

// const CategoryCarousel = dynamic(() => import('../../components/Layout/components/www/category-thumbnail.component'), { ssr: false });
const Modal = dynamic(() => import('../../components/Modal/components/modal.component'), { ssr: false });

const Menu: React.FC<MenuProps> = ({ data, contacts }) => {
    const catData = data && data.map((category, i) => ({id: category.id, name: category.name, isActive: false}));

    return (
        <>
            <div className="menu-container">
                {data && <CategoryCarousel data={catData as CategoryCarouselItemProps[]} />}
                {data && data.map((category, i) => (
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
                        isActive={false}
                    />
                ))}

                {/* {data.slice(0, initialObjectCount).map((category, i) => (
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
                ))} */}
            </div>
            <Modal />
        </>
    );
};

export default Menu;
