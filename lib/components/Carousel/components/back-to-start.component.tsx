import type { CarouselBackToStartProps } from "../carousel.props";
import React from "react";

const BackToStart: React.FC<CarouselBackToStartProps> = ({ rotate, color = '#ffffff' }) => {
    const rotation = rotate * 360;

    return (
        <svg
            className="svg-test"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width="100%"
            opacity={rotate}
        >
            <g>
                <g style={{ transform: `rotate(${rotation}deg)` }}>
                    <path
                        strokeWidth="6"
                        stroke={color}
                        fill="none"
                        x="0"
                        y="0"
                        d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843"
                    ></path>
                    <path fill={color} d="M49 7L49 23L57 15L49 7"></path>
                </g>
            </g>
        </svg>
    );
};

export default BackToStart;
