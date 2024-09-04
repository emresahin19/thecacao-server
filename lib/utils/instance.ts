import axios from 'axios';
import Cookies from 'js-cookie';
import { apiUrl } from '@asim-ui/constants';

const axiosInstance = axios.create({
    withCredentials: true,
});

const getCsrfToken = async () => {
    let token = Cookies.get('XSRF-TOKEN');
    
    if (token) {
        return token;
    }

    const response = await axios.get(`${apiUrl}/sanctum/csrf-cookie`, { withCredentials: true });
    const xsrfCookie = response.headers['set-cookie']?.find(cookie => cookie.startsWith('XSRF-TOKEN='));

    if (xsrfCookie) {
        const xsrfToken = xsrfCookie.split(';')[0].split('=')[1];
        Cookies.set('XSRF-TOKEN', xsrfToken, { sameSite: 'Lax' });
        return decodeURIComponent(xsrfToken);
    }
    
    return null;
};

export const fetcher = async (url: string) => {
    try {
        const response = await axiosInstance.get(url);
        return response;
    } catch (error) {
        return error;
    }
};

axiosInstance.interceptors.request.use(async config => {
    const token = await getCsrfToken();
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
