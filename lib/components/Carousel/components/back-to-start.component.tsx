import type { CarouselBackToStartProps } from "../carousel.props";
import React, { useEffect, useRef } from "react";

const BackToStart: React.FC<CarouselBackToStartProps> = ({ rotate, color = '#ffffff' }) => {
    const spinnerRef = useRef<HTMLDivElement>(null);
    const rotation = rotate * 360;
    console.log(rotate)

    useEffect(() => {
        const rotation = rotate * 360;
        spinnerRef.current!.style.transform = `rotate(${rotation}deg)`;
    }, [rotate]);

    return (
        <div className="lds-roller" 
            ref={spinnerRef}
            style={{
                color,
                rotate: `${rotation}deg`
            }}
        >
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
        </div>
    );
};

export default BackToStart;
