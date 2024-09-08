import { cdnUrl, cfCdnUrl, dashUrl, productVariantQuality } from "@asim-ui/constants";
import { HexToRgba, ImageToCdnUrlProps } from "@asim-ui/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { 
    apiUrl, 
    extraImageHeight, 
    extraImageWidth, 
    productDetailVariantHeight, 
    productDetailVariantWidth, 
    productVariantHeight, 
    productVariantWidth, 
    sliderVariantHeight, 
    sliderVariantWidth 
} from '@asim-ui/constants';

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

function logError({ url, options, error = '', message = '', status = 500 }: { url: string, options: any, error?: string, message?: string, status?: number }) {
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

const imageToCdnUrl = ({image, width, height, type}: ImageToCdnUrlProps) => {
    if(!image) return '/images/the-cacao-logo.webp';

    const sizes = {
        'product': {
            _width: productVariantWidth,
            _height: productVariantHeight,
        },
        'product-detail': {
            _width: productDetailVariantWidth,
            _height: productDetailVariantHeight,
        },
        'slider': {
            _width: sliderVariantWidth,
            _height: sliderVariantHeight,
        },
        'extra': {
            _width: extraImageWidth,
            _height: extraImageHeight,
        }
    };

    const { _width, _height } = type 
        ? sizes[type] 
        : width && height 
            ? { _width: width, _height: height }
            : { _width: null, _height: null }

    const size = _width && _height ? `/mncropresize/${productVariantWidth}/${productVariantHeight}` : '';

    return `${cdnUrl}${size}/image/${image}`;
}

const imageToCFCdnUrl = ({image, width, height, type}: ImageToCdnUrlProps) => {
    if(!image) return '/images/the-cacao-logo.webp';

    const size = `w=${productVariantWidth},h=${productVariantHeight},fit=${productVariantQuality}`;
    console.log(`${cfCdnUrl}${size}`)
    return `${image}${size}`;
}

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
    imageToCFCdnUrl,
}