import React, { useState, useEffect, useRef } from "react";
import { CategoryCarouselItemProps, CategoryCarouselProps } from "lib/interfaces";

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ data }) => {
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const transitionActive = useRef<boolean>(false);

    const handleCategoryClick = (id: number) => {
        if (transitionActive.current) return; // Geçiş sırasında tıklamaları engelle
        transitionActive.current = true;
        const element = document.getElementById(`category-${id}`);
        if (element) {
            const yOffset = -104; // İstediğiniz offset değeri
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveCategory(id);
        } else {
            transitionActive.current = false;
        }
    };

    useEffect(() => {
        let scrollTimeout: number | undefined;

        const handleScroll = () => {
            if (transitionActive.current) {
                if (scrollTimeout !== undefined) {
                    window.clearTimeout(scrollTimeout);
                }
                scrollTimeout = window.setTimeout(() => {
                    transitionActive.current = false;
                }, 100);
                return;
            }

            let closestCategoryId: number | null = null;
            let minDistance = Infinity;
            const viewportCenter = window.innerHeight / 2;

            for (let i = 0; i < data.length; i++) {
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
            if (activeCategory !== closestCategoryId) {
                setActiveCategory(closestCategoryId);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Bileşen ilk render edildiğinde kontrol et
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout !== undefined) {
                window.clearTimeout(scrollTimeout);
            }
        };
    }, [data, activeCategory]);

    useEffect(() => {
        if (activeCategory !== null && carouselRef.current) {
            const activeElement = carouselRef.current.querySelector(`.cc-item[data-id='${activeCategory}']`) as HTMLElement;
            if (activeElement && carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const activeElementLeft = activeElement.offsetLeft;
                const activeElementWidth = activeElement.offsetWidth;

                const scrollLeft = activeElementLeft - (carouselWidth / 2) + (activeElementWidth / 2);
                carouselRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
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
