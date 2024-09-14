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

    if(product.images) {
        formData.append('image_ids', product.images.map(image => image.id).join(','));
        product.images.forEach((image, index) => {
            image.file && formData.append(`images[${index}][file]`, image.file);
            image.url && formData.append(`images[${index}][url]`, image.url);
            image.id && formData.append(`images[${index}][id]`, String(image.id));
        });
    }

    if(product.extra && product.extra.length > 0) {
        product.extra.forEach((extra, index) => {
            formData.append(`extra[${index}]`, String(extra));
        })
    } else {
        formData.append('extra', '');
    }

    return formData;
};