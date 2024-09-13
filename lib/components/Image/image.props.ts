
export interface ImageProps {
    image: string;
    alt?: string;
    width?: number;
    height?: number;
    fit?: string | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
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
    fit?: string
}

export interface IconImageProps {
    src: string, 
    width?: number, 
    height?: number 
}