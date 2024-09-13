
export interface ImageProps {
    image: string;
    alt?: string;
    width?: number;
    height?: number;
    quality?: number;
    loading?: 'eager' | 'lazy';
    backgroundColor?: string;
    style?: React.CSSProperties;
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