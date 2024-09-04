import Image from "next/image"
import React from "react"
import type { IconImageProps } from "../image.props"

const IconImage: React.FC<IconImageProps> = ({src, width=16, height=16}) => {
    return (
        <Image 
            src={src} 
            width={width}
            height={height}
            alt="icon"
            priority={true} 
        />
    )
}

export default IconImage