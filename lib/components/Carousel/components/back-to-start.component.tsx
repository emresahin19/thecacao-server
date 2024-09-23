import type { CarouselBackToStartProps } from "../carousel.props";
import React, { useEffect, useRef, useState } from "react";

const BackToStart: React.FC<CarouselBackToStartProps> = ({ rotate = 0, color = '#ffffff' }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);
    
    useEffect(() => {
        const index = Math.floor(rotate * 12);
        setVisibleIndex(index);
    }, [rotate]);

    return (
        <div className="turn-to-back" style={{opacity: rotate}}>
            {[...Array(12)].map((_, index) => (
                visibleIndex > index && (<div  key={index}></div>)
            ))}
        </div>
    );
};

export default BackToStart;
