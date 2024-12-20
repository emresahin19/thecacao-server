import axiosInstance, { fetcher } from './instance';

import {
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
    customLoader,
    generateSrcSet,
    deserializeFilters,
    convertImageToBase64,
} from './helpers';

export { 
    axiosInstance,
    fetcher,
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
    customLoader,
    generateSrcSet,
    deserializeFilters,
    convertImageToBase64,
};
