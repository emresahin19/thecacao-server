import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    withCredentials: true,
});

export const fetcher = async (url: string) => {
    try {
        const response = await axiosInstance.get(url);
        return response;
    } catch (error) {
        return error;
    }
};

axiosInstance.interceptors.request.use(config => {
    const token = Cookies.get('jwt');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
