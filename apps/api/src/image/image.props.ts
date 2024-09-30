
export interface ImageVariant {
    width: number;
    height: number;
    format: 'png' | 'webp';
    quality: number;
}

export type ImageTypes = 'product' | 'product-detail' | 'slider' | 'extra' | 'table-avatar'; 