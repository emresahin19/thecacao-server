
export interface ImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    fit?: string | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    loading?: 'eager' | 'lazy';
    backgroundColor?: string;
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