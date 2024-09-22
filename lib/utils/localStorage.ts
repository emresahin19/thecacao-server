import { dashUrl } from "lib/constants";

export const setLocalStorageItem = (key: string, value: any) => {
    const type = typeof value === 'object' ? 'object' : 'string';
    if (typeof window !== 'undefined') {
        const force = window.location.href.startsWith(dashUrl);
        const cookieAllowed = key === 'cookieAllowed' || localStorage.getItem('cookieAllowed') === 'true';

        if(!cookieAllowed && !force) return;
        
        switch (type) {
            case 'object':
                localStorage.setItem(key, JSON.stringify(value));
                break;
            case 'string':
                localStorage.setItem(key, value);
                break;
            default:
                throw new Error('Invalid type specified');
        }
    }
};

export const getLocalStorageItem = (key: string) => {
    if (typeof window !== 'undefined') {
        const cookieAllowed = localStorage.getItem('cookieAllowed') === 'true';
        const force = window.location.href.startsWith(dashUrl);

        if(!cookieAllowed && !force) return null;

        const item = localStorage.getItem(key);
        const type = typeof JSON.parse(String(item)) === 'object' ? 'object' : 'string';
        if (item) {
            switch (type) {
                case 'object':
                    try {
                        return JSON.parse(item);
                    } catch (error) {
                        return null;
                    }
                case 'string':
                    return item;
                default:
                    throw new Error('Invalid type specified');
            }
        }
        return null;
    }
    return null;
};

export const removeLocalStorageItem = (key: string) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};
