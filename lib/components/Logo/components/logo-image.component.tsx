import { ImageProps } from "lib/interfaces"
import { imageToCdnUrl } from "lib/utils";
import React from "react"
import CustomImage from "../../Image/components/custom-image.component";

const LogoImage: React.FC<ImageProps> = ({image, width=16, height=16, style}) => {
    return (
        <CustomImage 
            image={image} 
            width={width}
            height={height}
            alt="icon"
            loading="eager"
            // {...style && {style}}
            
        />
    )
}

export default LogoImage