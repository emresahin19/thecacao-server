import { ImageObject, UseItemProps } from 'lib/interfaces';
import { axiosInstance } from 'lib/utils';
import axios, { AxiosResponse } from 'axios';

interface ItemRequestProps<T> extends UseItemProps<T> {
    item: T;
    isFormData?: boolean;
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

export const saveItem = async <T>({id, route, item, isFormData = false}: ItemRequestProps<T>): Promise<AxiosResponse<T>> => {
    try {
        const data = isFormData ? await prepareItemFormData({ item }) : item;
        
        const response = id
            ? await axiosInstance.put(`/api/${route}/${id}`, data)
            : await axiosInstance.post(`/api/${route}/create`, data);
        
        return response;
    } catch (error) {
        console.error('Error saving item:', error);
        throw error;
    }
};

export const prepareItemFormData = async <T extends Record<keyof T, any>>({ item }: { item: T }): Promise<FormData> => {
    const formData = new FormData();
    console.log('item:', item);
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

        if (key === 'image') {
            const image = value as ImageObject;
            if (image.id) formData.append(`imageObj[id]`, String(value.id));
            if (image.file) formData.append(`imageObj[file]`, value.file);
            continue;
        }

        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    }

    return formData;
};
