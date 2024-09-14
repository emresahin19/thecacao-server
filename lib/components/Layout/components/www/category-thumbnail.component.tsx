import React from "react"
import { CategoryCarouselItemProps, CategoryCarouselProps } from "lib/interfaces";


const CategoryCarousel: React.FC<CategoryCarouselProps> = ({data}) => {

    const handleCategoryClick = (id: number) => {
        const element = document.getElementById(`category-${id}`);
        if (element) {
            const yOffset = -104; // The offset you want
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
    
        <div className="category-carousel">
            {data.map((category: CategoryCarouselItemProps) => 
                <a
                    className="cc-item"
                    role="button"
                    key={`cc-${category.id}`}
                    aria-label={`${category.name} Kategorisine Git`}
                    onClick={() => handleCategoryClick(category.id)}
                >
                    {category.name}
                </a>
            )}
        </div>
    )
}

export default CategoryCarousel;