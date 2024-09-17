import React, { useState, useEffect, useRef } from "react";
import { CategoryCarouselItemProps, CategoryCarouselProps } from "lib/interfaces";

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ data }) => {
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCategoryClick = (id: number) => {
        const element = document.getElementById(`category-${id}`);
        if (element) {
            const yOffset = -104; // The offset you want
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            let closestCategoryId: number | null = null;
            let minDistance = Infinity;
            const viewportCenter = window.innerHeight / 2;

            for(let i = 0; i < data.length; i++) {
                const category = data[i];
                const element = document.getElementById(`category-${category.id}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(elementCenter - viewportCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCategoryId = category.id;
                    }
                }
            }
            activeCategory != closestCategoryId && setActiveCategory(closestCategoryId);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check in case the component is rendered mid-scroll
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [data]);

    useEffect(() => {
        if (activeCategory !== null && carouselRef.current) {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                const activeElement = carouselRef.current?.querySelector(`.cc-item[data-id='${activeCategory}']`) as HTMLElement;
                if (activeElement && carouselRef.current) {
                    const carouselWidth = carouselRef.current.offsetWidth;
                    const activeElementLeft = activeElement.offsetLeft;
                    const activeElementWidth = activeElement.offsetWidth;

                    const scrollLeft = activeElementLeft - (carouselWidth / 2) + (activeElementWidth / 2);
                    carouselRef.current?.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }, 100);
        }
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activeCategory]);

    return (
        <div className="category-carousel" ref={carouselRef}>
            {data.map((category: CategoryCarouselItemProps) => (
                <a
                    className={`cc-item ${category.id === activeCategory ? 'active' : ''}`}
                    role="button"
                    key={`cc-${category.id}`}
                    aria-label={`${category.name} Kategorisine Git`}
                    onClick={() => handleCategoryClick(category.id)}
                    data-id={category.id}
                >
                    {category.name}
                </a>
            ))}
        </div>
    );
};

export default CategoryCarousel;
