import { LoginFormProps } from '@asim-ui/interfaces';
import { axiosInstance } from '@asim-ui/utils';

export const fetchAuthenticatedUser = async () => {
    return await axiosInstance.get(`/api/auth/user`); 
};

export const login = async ({ email, password, remember }: LoginFormProps) => {
    return await axiosInstance.post('/api/auth/login', { email, password, remember });
};

export const logout = async () => {
    return await axiosInstance.post(`/api/auth/logout`);
};
