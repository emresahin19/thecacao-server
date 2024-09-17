import React, { useState } from "react";
import type { CategoryCarouselItemProps, MenuProps } from "../../interfaces";

import CategorySection from '../../components/Card/components/category-card.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';

const Menu: React.FC<MenuProps> = ({ data }) => {
    const catData = data && data.map(category => ({ id: category.id, name: category.name }));
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    return (
        <>
            {data && <CategoryCarousel data={catData as CategoryCarouselItemProps[]} activeCategory={activeCategory} />}
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
                    setActiveCategory={setActiveCategory}
                />
            ))}
        </>
    );
};

export default Menu;
