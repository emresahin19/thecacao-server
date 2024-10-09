import { ImageObject, UseItemProps } from 'lib/interfaces';
import { axiosInstance } from 'lib/utils';
import axios, { AxiosResponse } from 'axios';

interface ItemRequestProps<T> extends UseItemProps<T> {
    data: T;
}

export const fetchItem = async <T>({id, route}: UseItemProps<T>): Promise<T> => {
    try {
        const response = await axiosInstance.get(`/api/${route}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
};

export const saveItem = async <T>({id, route, data}: ItemRequestProps<T>): Promise<AxiosResponse<T>> => {
    try {
        const response = id
            ? await axiosInstance.put(`/api/${route}/${id}`, data)
            : await axiosInstance.post(`/api/${route}/create`, data);
        
        return response;
    } catch (error) {
        console.error('Error saving item:', error);
        throw error;
    }
};

export const prepareItemFormData = async <T extends Record<string, any>>({ item }: { item: T }): Promise<FormData> => {
    const formData = new FormData();

    for (const key in item) {
        const value = item[key];
        if (Array.isArray(value)) {
            if (key === 'images') {
                value.forEach((image: ImageObject, index: number) => {
                    if (image.id) formData.append(`files[${index}][id]`, String(image.id));
                    if (image.file) formData.append(`files[${index}][file]`, image.file);
                    if (image.file) formData.append(`files[${index}][index]`, String(index));
                });
                continue;
            }
            formData.append(key, JSON.stringify(value));
            continue;
        }

        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    }

    return formData;
};
