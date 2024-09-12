import { apiUrl } from '@asim-ui/constants';
import { LoginFormProps } from '@asim-ui/interfaces';
import { axiosInstance } from '@asim-ui/utils';

export const fetchAuthenticatedUser = async () => {
    return await axiosInstance.post(`/api/auth/user`); 
};

export const login = async ({ email, password, remember = false }: LoginFormProps) => {
    return await axiosInstance.post(`${apiUrl}/auth/login`, { email, password, remember }); 
};

export const logout = async () => {
    return await axiosInstance.post(`/api/auth/logout`);
};
