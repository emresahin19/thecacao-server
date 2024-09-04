import React from "react"
import { RootState } from '@asim-ui/store';
import { useSelector } from 'react-redux';
import { CategoryProps } from "@asim-ui/interfaces";

const CategoryCarousel: React.FC = () => {
    const { data } = useSelector((state: RootState) => state.menu);

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
            {data.map((category: CategoryProps) => 
                <button
                    key={`cc-${category.id}`}
                    aria-label={`${category.name} Kategorisine Git`}
                    onClick={() => handleCategoryClick(category.id)}
                >
                    {category.name}
                </button>
            )}
        </div>
    )
}

export default CategoryCarousel;