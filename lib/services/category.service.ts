import { axiosInstance } from 'lib/utils';
import { CategoryDataProps } from 'lib/interfaces';

export const fetchCategory = async (id: string | number) => {
    try {
        const response = await axiosInstance.get(`/api/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

export const saveCategory = async (category: CategoryDataProps) => {
    const id = category.id;
    try {
        const response = id
            ? await axiosInstance.put(`/api/categories/${id}`, category)
            : await axiosInstance.post(`/api/categories/create`, category);

        return response;
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
};

export const deleteCategory = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`/api/categories/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};
