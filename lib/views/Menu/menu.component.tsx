import React, { useState, useEffect, useRef } from "react";
import type { CategoryCarouselItemProps, MenuProps } from "../../interfaces";

import CategorySection from '../../components/Card/components/category-card.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';

const Menu: React.FC<MenuProps> = ({ data }) => {
    const catData = data && data.map(category => ({ id: category.id, name: category.name }));
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<{ [key: number]: boolean }>({});
    const categoryRefs = useRef<{ [key: number]: HTMLElement | null }>({});

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };
    
        const observer = new IntersectionObserver((entries) => {
            let newActiveCategory = activeCategory; // Geçici değişken
            const viewportHeight = window.innerHeight;
    
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if(!entry.isIntersecting) continue;

                const categoryId = Number(entry.target.getAttribute('data-id'));
                const entryTop = entry.boundingClientRect.top;
                
                if(!visibleCategories[categoryId])
                    setVisibleCategories(prev => ({ ...prev, [categoryId]: true }));

                if(entryTop * 2 < viewportHeight)
                    newActiveCategory = categoryId;
            }
    
            newActiveCategory !== activeCategory && setActiveCategory(newActiveCategory);
        }, observerOptions);
    
        Object.values(categoryRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });
    
        return () => {
            observer.disconnect();
        };
    }, [visibleCategories, activeCategory]);

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
                    isVisible={!!visibleCategories[category.id] || i < 3}
                    ref={(el: HTMLDivElement | null) => { categoryRefs.current[category.id] = el; }}
                />
            ))}
        </>
    );
};

export default Menu;
