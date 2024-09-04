import { axiosInstance } from '@asim-ui/utils';
import { CategoryDataProps } from '@asim-ui/interfaces';

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
    const id = category.id || 0;

    try {
        const response = id
            ? await axiosInstance.put(`/api/categories/${id}`, category)
            : await axiosInstance.post(`/api/categories`, category);

        return response.data;
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
};

export const deleteCategory = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`/api/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};
