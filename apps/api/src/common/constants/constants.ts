export const DB_DATABASE = process.env.DB_DATABASE || 'base';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
export const DB_USERNAME = process.env.DB_USERNAME || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'supersecretpassword';

export const APP_PORT = process.env.API_PORT || 4040;
export const APP_URL = process.env.API_URL || 'http://localhost:4040';
export const APP_DOMAIN = process.env.API_DOMAIN || 'localhost:4040';

export const DASH_URL = process.env.NEXT_PUBLIC_DASH_URL || 'http://localhost:3000';

export const productVariantWidth = parseInt(process.env.NEXT_PUBLIC_PRODUCT_VARIANT_WIDTH || '360');
export const productVariantHeight = parseInt(process.env.NEXT_PUBLIC_PRODUCT_VARIANT_HEIGHT || '300');
export const productVariantQuality = parseInt(process.env.NEXT_PUBLIC_PRODUCT_VARIANT_QUALITY || '80');

export const productDetailVariantWidth = parseInt(process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_WIDTH || '1080');
export const productDetailVariantHeight = parseInt(process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_HEIGHT || '900');
export const productDetailVariantQuality = parseInt(process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_QUALITY || '80');

export const sliderVariantWidth = parseInt(process.env.NEXT_PUBLIC_SLIDER_VARIANT_WIDTH || '399');
export const sliderVariantHeight = parseInt(process.env.NEXT_PUBLIC_SLIDER_VARIANT_HEIGHT || '197');
export const sliderVariantQuality = parseInt(process.env.NEXT_PUBLIC_SLIDER_VARIANT_QUALITY || '80');

export const extraImageWidth = parseInt(process.env.NEXT_PUBLIC_EXTRA_IMAGE_WIDTH || '60');
export const extraImageHeight = parseInt(process.env.NEXT_PUBLIC_EXTRA_IMAGE_HEIGHT || '60');
export const extraImageQuality = parseInt(process.env.NEXT_PUBLIC_EXTRA_IMAGE_QUALITY || '80');