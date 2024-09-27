import { axiosInstance } from 'lib/utils';
import { ProductDataProps } from 'lib/interfaces';

export const fetchProduct = async (id: string | number) => {
    try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export const saveProduct = async (product: ProductDataProps) => {
    const id = product.id || 0;
    const formData = prepareProductFormData(product);

    try {
        const response = id
            ? await axiosInstance.put(`/api/products/${id}`, formData)
            : await axiosInstance.post(`/api/products/0`, formData);

        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const prepareProductFormData = (product: ProductDataProps) => {
    const formData = new FormData();
    
    product.id && formData.append('id', String(product.id));
    formData.append('category_id', String(product.category_id));
    formData.append('name', product.name);
    formData.append('price', String(product.price || 0));
    formData.append('recipe', String(product.recipe || ''));
    formData.append('description', String(product.description || ''));
    formData.append('passive', String(product.passive || 0));
    formData.append('extra', JSON.stringify(product.extra || []));
    
    const fileMap: {
        id?: number | string | null;
        fieldName: string;
        isFileExists: boolean;
    }[] = [];

    product.images && product.images.forEach((image, index) => {
        image.id && formData.append(`files[${index}][id]`, String(image.id));
        image.file && formData.append(`files[${index}][file]`, image.file);
        fileMap.push({
            id: image.id,
            fieldName: `files[${index}][file]`,
            isFileExists: Boolean(image.file),
        });
    });

    formData.append('fileMap', JSON.stringify(fileMap));

    return formData;
};