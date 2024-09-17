import React, { useEffect, useRef } from "react";
import { CategoryCarouselItemProps, CategoryCarouselProps } from "lib/interfaces";

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ data, activeCategory }) => {
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCategoryClick = (id: number) => {
        const element = document.getElementById(`category-${id}`);
        if (element) {
            const yOffset = -104;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

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
            }, 300);
        }

        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activeCategory]);

    return (
        <div className="category-carousel" ref={carouselRef}>
            {data.map((category: CategoryCarouselItemProps) => 
                <a
                    className={`cc-item ${activeCategory === category.id ? 'active' : ''}`}
                    role="button"
                    key={`cc-${category.id}`}
                    data-id={category.id}
                    aria-label={`${category.name} Kategorisine Git`}
                    onClick={() => handleCategoryClick(category.id)}
                >
                    {category.name}
                </a>
            )}
        </div>
    );
};

export default CategoryCarousel;
