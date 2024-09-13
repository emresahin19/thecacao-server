import { ImageProps } from "@asim-ui/interfaces"
import { imageToCdnUrl } from "@asim-ui/utils";
import Image from "next/image"
import React from "react"

const LogoImage: React.FC<ImageProps> = ({image, width=16, height=16, style}) => {
    const url = imageToCdnUrl({ image, width: width * 2, height: height * 2 });
    
    return (
        <Image 
            src={url} 
            width={width}
            height={height}
            alt="icon"
            priority={true}
            loading="eager"
            // {...style && {style}}
            
        />
    )
}

export default LogoImage