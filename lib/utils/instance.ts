import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const axiosInstance: AxiosInstance = axios.create({
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

export const tableFetcher = async <T>(url: string): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.get(url);
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response;
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
