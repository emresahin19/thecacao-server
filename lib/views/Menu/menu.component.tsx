import type { CategoryCarouselItemProps, MenuProps } from "@asim-ui/interfaces";
import React from "react";

import CategorySection from '../../components/Card/components/category-card.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';

const Menu: React.FC<MenuProps> = ({ data }) => {
    const catData = data && data.map(category => ({id: category.id, name: category.name, isActive: false}));

    return (
        <>
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
        </>
    );
};

export default Menu;
