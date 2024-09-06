export * from './status-code';

export const dbName = process.env.DB_NAME || 'base';
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbPort = parseInt(process.env.DB_PORT || '3306');
export const dbUsername = process.env.DB_USERNAME || 'root';
export const dbPassword = process.env.DB_PASSWORD || 'supersecretpassword';

export const apiPort = parseInt(process.env.API_PORT || '4040');
export const apiHost = process.env.API_HOST || 'http://localhost:4040';

export const APP_PORT = process.env.API_PORT || 4040;
export const APP_URL = process.env.API_URL || 'http://localhost:4040';
export const APP_DOMAIN = process.env.API_DOMAIN || 'localhost:4040';
export const productVariantWidth = parseInt(process.env.NEXT_PUBLIC_PRODUCT_VARIANT_WIDTH || '360');
export const productVariantHeight = parseInt(process.env.NEXT_PUBLIC_PRODUCT_VARIANT_HEIGHT || '314');
export const productVariantQuality = process.env.NEXT_PUBLIC_PRODUCT_VARIANT_QUALITY || 'cover';

export const productDetailVariantWidth = parseInt(process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_WIDTH || '427');
export const productDetailVariantHeight = parseInt(process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_HEIGHT || '293');
export const productDetailVariantQuality = process.env.NEXT_PUBLIC_PRODUCT_DETAIL_VARIANT_FIT || 'cover';

export const sliderVariantWidth = parseInt(process.env.NEXT_PUBLIC_SLIDER_VARIANT_WIDTH || '399');
export const sliderVariantHeight = parseInt(process.env.NEXT_PUBLIC_SLIDER_VARIANT_HEIGHT || '197');
export const sliderVariantFit = process.env.NEXT_PUBLIC_SLIDER_VARIANT_FIT || 'cover';

export const slideWidthDefault = parseInt(process.env.NEXT_PUBLIC_SLIDE_WIDTH || '70');
export const carouselLengthOnScreen = parseInt(process.env.NEXT_PUBLIC_CAROUSEL_LENGTH_ON_SCREEN || '2');

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040';
export const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:4040';
export const wwwUrl = process.env.NEXT_PUBLIC_WWW_URL || 'http://localhost:4020';
export const dashUrl = process.env.NEXT_PUBLIC_DASH_URL || 'http://localhost:4030';

export const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'production';

export const defaultColor = `#${process.env.NEXT_PUBLIC_DEFAULT_COLOR || 'ffffff'}`;

export const menuCacheKey = process.env.NEXT_PUBLIC_MENU_CACHE_KEY || 'menu';
export const sliderCacheKey = process.env.NEXT_PUBLIC_SLIDER_CACHE_KEY || 'slider';

export const placeholderImage = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE || 'https://cdn.thecacao.com.tr/cdn-cgi/imagedelivery/rBgVS91gjsIS-MTm0-R2dg/7c941f89-05eb-4804-1b08-35d3639a9c00/';
export const placeholderImageBg = process.env.NEXT_PUBLIC_PLACEHOLDER_BG_IMAGE_URL || 'https://cdn.thecacao.com.tr/cdn-cgi/imagedelivery/rBgVS91gjsIS-MTm0-R2dg/debfbb12-2ee0-4679-2e4b-e3dee8077d00/';

export const extraImageWidth = parseInt(process.env.NEXT_PUBLIC_EXTRA_IMAGE_WIDTH || '60');
export const extraImageHeight = parseInt(process.env.NEXT_PUBLIC_EXTRA_IMAGE_HEIGHT || '60');
export const extraImageFit = process.env.NEXT_PUBLIC_EXTRA_IMAGE_FIT || 'cover';

export const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export const metaTitle = `The Cacao Chocolate & Coffee`
export const metaDescription = `The Cacao Chocolate & Coffee, Gebze'de çikolata ve kahve üzerine uzmanlaşmış, dünya mutfağından zengin yemek menüsü sunan bir mekandır. En kaliteli çikolata, kahve çeşitleri ve leziz yemekleriyle unutulmaz bir deneyim yaşayın. Gebze'nin en iyi çikolata ve kahve mekanını keşfedin!`
export const metaImageWidth = '1920'
export const metaImageHeight = '960'
export const metaImage = `${placeholderImageBg}w=${metaImageWidth},h=${metaImageHeight},fit=${productVariantQuality}`