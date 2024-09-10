import { ImageProps } from "@asim-ui/interfaces"
import { imageToCdnUrl } from "@asim-ui/utils";
import Image from "next/image"
import React from "react"

const LogoImage: React.FC<ImageProps> = ({image, width=16, height=16}) => {
    const url = imageToCdnUrl({ image, width, height });
    
    return (
        <Image 
            src={url} 
            width={width}
            height={height}
            alt="icon"
            priority={true} 
        />
    )
}

export default LogoImage