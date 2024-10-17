export * from './status-code';

export const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'production';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040';
export const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:4040';
export const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:4020';
export const wwwUrl = process.env.NEXT_PUBLIC_WWW_URL || 'http://localhost:4020';
export const dashUrl = process.env.NEXT_PUBLIC_DASH_URL || 'http://localhost:4040';
export const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:4040';
export const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://media.thecacao.com.tr';
export const cfCdnUrl = process.env.NEXT_PUBLIC_CF_CDN_URL || 'https://cdn.thecacao.com.tr/cdn-cgi/imagedelivery';

export const dbName = process.env.DB_NAME || 'base';
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbPort = parseInt(process.env.DB_PORT || '3306');
export const dbUsername = process.env.DB_USERNAME || 'root';
export const dbPassword = process.env.DB_PASSWORD || 'supersecretpassword';

export const apiPort = parseInt(process.env.API_PORT || '4040');
export const apiHost = process.env.API_HOST || 'http://localhost:4040';

export const slideWidthDefault = parseInt(process.env.NEXT_PUBLIC_SLIDE_WIDTH || '70');
export const carouselLengthOnScreen = parseInt(process.env.NEXT_PUBLIC_CAROUSEL_LENGTH_ON_SCREEN || '2');

export const defaultColor = `#${process.env.NEXT_PUBLIC_DEFAULT_COLOR || 'ffffff'}`;

export const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '';
export const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || '';
export const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || '';
export const companyFacebook = process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || '';
export const companyInstagram = process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM || '';
export const companyStreet = process.env.NEXT_PUBLIC_COMPANY_STREET || '';
export const companyCity = process.env.NEXT_PUBLIC_COMPANY_CITY || '';
export const companyZip = process.env.NEXT_PUBLIC_COMPANY_ZIP || '';
export const companyCountry = process.env.NEXT_PUBLIC_COMPANY_COUNTRY || '';
export const companyOpeningHours = process.env.NEXT_PUBLIC_COMPANY_OPENING_HOURS || '';
export const companyClosingHours = process.env.NEXT_PUBLIC_COMPANY_CLOSING_HOURS || '';
export const companyGeoLat = process.env.NEXT_PUBLIC_COMPANY_GEO_LAT || '';
export const companyGeoLng = process.env.NEXT_PUBLIC_COMPANY_GEO_LNG || '';

export const menuCacheKey = process.env.NEXT_PUBLIC_MENU_CACHE_KEY || 'menu';
export const sliderCacheKey = process.env.NEXT_PUBLIC_SLIDER_CACHE_KEY || 'slider';

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

export const placeholderProductImage = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE
export const placeholderProductImageBg = process.env.NEXT_PUBLIC_PLACEHOLDER_BG_IMAGE;
export const logoImage = process.env.NEXT_PUBLIC_LOGO_IMAGE || 'the-cacao-logo.png';

export const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export const metaTitle = `The Cacao Chocolate & Coffee`
export const metaDescription = `The Cacao, Gebze'de çikolata, kahve ve dünya mutfağından lezzetler sunan bir mekandır. Kaliteli çikolata, kahve çeşitleri ve yemeklerle keyifli bir deneyim yaşayın.`
export const metaKeywords = `çikolata, kahve, dünya mutfağı, Gebze, The Cacao, tatlı, çikolata dükkanı, kahveci, restoran, lezzet`
export const metaImageWidth = 1920;
export const metaImageHeight = 960;

export const metaImage = `${cdnUrl}/images/crop,w=${metaImageWidth},h=${metaImageHeight},f=webp,q=80/${placeholderProductImageBg}`;