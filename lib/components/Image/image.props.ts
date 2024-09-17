
export interface ImageProps {
    image?: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    loading?: 'eager' | 'lazy';
    format?: 'webp' | 'jpg' | 'png';
    type?: 'product' | 'product-detail' | 'slider' | 'extra';
    backgroundColor?: string;
    style?: React.CSSProperties;
}

export interface SrcSetProps {
    x1: string;
    x2?: string;
    x3?: string;
}

export interface PlaceholderImageProps {
    alt: string
    loading?: 'eager' | 'lazy'
    backgroundColor?: string
    width?: number
    height?: number
    quality?: number
}

export interface IconImageProps {
    src: string, 
    width?: number, 
    height?: number 
}