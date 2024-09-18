import React, { useState, useEffect } from "react";
import type { CategoryCarouselItemProps, MenuProps } from "../../interfaces";

import CategorySection from '../../components/Card/components/category-card.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';
import { setContacts, setMenuData } from "lib/store";
import { useDispatch } from "react-redux";

const Menu: React.FC<MenuProps> = ({ data, contacts }) => {
    const catData = data && data.map(category => ({ id: category.id, name: category.name }));
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        data && dispatch(setMenuData({data}));
        contacts && dispatch(setContacts(contacts));
    }, [data, dispatch, contacts]);

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
