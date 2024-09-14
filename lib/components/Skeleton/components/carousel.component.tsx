import React, { memo } from "react"
import ProductSkeletonCard from "./product-card.component"

const CarouselSkeleton: React.FC = () => {
    return (
        <>
            <div className="carousel">
                <div className="carousel-wrapper">
                    <div className="carousel-inner">
                        <div className="carousel-item carousel-2-item">
                            <ProductSkeletonCard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(CarouselSkeleton)