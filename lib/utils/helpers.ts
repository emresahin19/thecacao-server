import { cdnUrl, dashUrl, placeholderProductImage } from "../constants";
import { HexToRgba, CustomImageProps, ImageProps } from "../interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { 
    extraImageHeight, 
    extraImageWidth, 
    productDetailVariantHeight, 
    productDetailVariantWidth, 
    productVariantHeight, 
    productVariantWidth, 
    sliderVariantHeight, 
    sliderVariantWidth 
} from '../constants';
import { ImageLoader } from "next/image";

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const useShallowRouting = (url: string) => {
    if(!window.history.pushState) return;
    window.history.pushState({}, '', url);
};

const isValidUrl = (urlString: string) => {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
};

const hexToRgba: HexToRgba = (hex, opacity) => {
    hex = hex.replace('#', '');

    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

function logError({ url, options, error = '', message = '', status = 500 }: { url: string, options: object, error?: string, message?: string, status?: number }) {
    console.error(`URL: ${url}`);
    console.error(`Error: ${error}`);
    console.error(`Message: ${message}`);
    console.error(`Options: ${JSON.stringify(options)}`);
    console.error(`Status: ${status}`);
}

const dateToString = (date: string | undefined | null, time: boolean = false) => {
    if (date === null || date === undefined || date === '') return '';

    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    let datePart: string = '';
    let timePart: string = '';

    if (date.includes('T')) {
        [datePart, timePart] = date.split('T');
        timePart = timePart.split('.')[0]; 
    } else if (date.includes(' ')) {
        [datePart, timePart] = date.split(' ');
    } else {
        datePart = date;
    }

    const [year, month, day] = datePart.split('-');
    const formattedDate = `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;

    if (!time || !timePart) return formattedDate;

    const [hours, minutes] = timePart.split(':');
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
};

const createHeaders = (req: NextApiRequest, xsrfToken: string | undefined) => {
    return {
        'Cookie': req.headers.cookie || '',
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        'Origin': req.headers.origin || dashUrl,
    };
};

const handleErrorResponse = (err: any, res: NextApiResponse) => {
    console.log(err.response?.data);
    const error = err.response || err || 'Internal server error';
    const status = error.status || 500;
    const message = error.data?.message || err.message || 'Internal server error';
    return res.status(status).json({ error: message });
};

const serializeFilters = (filters: { [key: string]: any }) => {
    return Object.keys(filters)
        .map(key => {
            const value = filters[key];
            if (Array.isArray(value)) {
                const arrayValues = value.map((item: { value: any }) => item.value).join(',');
                return `${encodeURIComponent(key)}=${encodeURIComponent(arrayValues)}${value.length > 0 ? ',' : ''}`;
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');
};

const imageToCdnUrl = ({ image, width, height, type, format = 'webp', quality = 80 }: ImageProps) => {
    if (!image) return `${cdnUrl}/images/the-cacao-logo.webp`;

    const { w, h } = imageSizeCalc({ width, height, type });

    const size = type 
        ? `/${type}` 
        : w && h 
            ? `/crop,w=${w},h=${h},f=${format},q=${quality}` 
            : '';
            
    return `${cdnUrl}/images${size}/${image}`;
};

const imageToCdnSet = ({ image, width, height, type, format, quality }: ImageProps) => {
    image = image || placeholderProductImage;

    const { w, h } = imageSizeCalc({ width, height, type });

    if (!w || !h) return {
        src: `${cdnUrl}/images/the-cacao-logo.webp`,
    };

    const x1 = {
        key: '1x',
        w: Math.ceil(w * 0.8),
        h: Math.ceil(h * 0.8),
        q: quality
    }

    const x2 = {
        key: '2x',
        w: w,
        h: h,
        q: quality
    }

    const x3 = {
        key: '3x',
        w: Math.ceil(w * 1.5),
        h: Math.ceil(h * 1.5),
        q: quality
    }

    const x1Src = imageToCdnUrl({ image, width: x1.w, height: x1.h, format, quality });
    const x2Src = imageToCdnUrl({ image, width: x2.w, height: x2.h, format, quality });
    const x3Src = imageToCdnUrl({ image, width: x3.w, height: x3.h, format, quality });

    return {
        srcSet: `${x1Src} 1x, ${x2Src} 2x`,
        sizes: `(max-width: 900px) ${x1.w}px, ${x2.w}px`,
        src: x1Src,
    };
};


const imageSizeCalc = ({ width, height, type }: ImageProps) => {
    const sizes = {
        'product': {
            w: productVariantWidth,
            h: productVariantHeight,
        },
        'product-detail': {
            w: productDetailVariantWidth,
            h: productDetailVariantHeight,
        },
        'slider': {
            w: sliderVariantWidth,
            h: sliderVariantHeight,
        },
        'extra': {
            w: extraImageWidth,
            h: extraImageHeight,
        }
    };

    const { w, h } = type ? sizes[type] : { w: width, h: height };
    return { w, h };
};

const customLoader: ImageLoader = ({ src, width, quality }) => {
    // Varsayılan kalite
    const newQuality = quality || 80;
    const format = 'webp'; // Varsayılan format

    // URL'deki mevcut width ve height değerlerini yakalamak için regex
    const regex = /crop,w=(\d+),h=(\d+),f=([a-zA-Z]+),q=(\d+)/;
    const match = src.match(regex);

    let newWidth = width;
    let newHeight;

    if (match) {
        // Mevcut width ve height değerlerini yakala
        const currentWidth = parseInt(match[1], 10);
        const currentHeight = parseInt(match[2], 10);

        // Oranı koruyarak yeni height'ı hesapla
        const aspectRatio = currentHeight / currentWidth;
        newHeight = Math.round(newWidth * aspectRatio);
    }

    // Yeni src'yi oluştur
    const newSrc = src.replace(regex, `crop,w=${newWidth},h=${newHeight},f=${format},q=${newQuality}`);

    return newSrc;
};

// Custom srcSet oluşturma fonksiyonu
const generateSrcSet = (src: string, width: number, quality: number = 80) => {
    // 1x, 2x ve 3x boyutları için URL'leri oluştur
    const sizes = [1, 2, 3].map((scale) => {
        const newWidth = width * scale;
        const newHeight = Math.round(newWidth * 0.833); // Oranı koruyor (360x300'ün 0.833 oranı)
        return `${src.replace(/crop,w=\d+,h=\d+,/, `crop,w=${newWidth},h=${newHeight},`)} ${newWidth}w`;
    });

    return sizes.join(', ');
};

// const customLoader: ImageLoader = ({ src, width, quality }) => {
//     const serveUrl = 'https://serve.thecacao.com.tr';
//     return `${serveUrl}/${src}?w=${width}&q=${quality || 80}`;
// }

export {
    sleep,
    useShallowRouting,
    isValidUrl,
    hexToRgba,
    logError,
    dateToString,
    createHeaders,
    handleErrorResponse,
    serializeFilters,
    imageToCdnUrl,
    imageToCdnSet,
    imageSizeCalc,
    customLoader,
    generateSrcSet,
}