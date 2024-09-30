import { axiosInstance } from 'lib/utils';
import { ProductDataProps, ProductProps } from 'lib/interfaces';

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
    const id = product.id;
    const formData = prepareProductFormData(product);
    
    try {
        const response = id
            ? await axiosInstance.put(`/api/products/${id}`, formData)
            : await axiosInstance.post(`/api/products/create`, formData);

        return response;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const saveAsField = async (product: ProductProps) => {
    const _product: ProductDataProps = convertToProductDataProps(product);
    const formData = prepareProductFormData(_product);
    
    try {
        const response = await axiosInstance.put(`/api/products/${product.id}`, formData)
        return response;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export const deleteProduct = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`/api/products/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const convertToProductDataProps = (product: ProductProps): ProductDataProps => {
    return {
        id: product.id,
        category_id: product.category_id ?? (product.category ? product.category.id : 0),
        name: product.name,
        price: product.price,
        recipe: product.recipe,
        description: product.description,
        images: product.images,
        extra: product.extra || [],
        passive: product.passive,
    };
};

export const prepareProductFormData = (product: ProductDataProps) => {
    const formData = new FormData();
    
    product.id && formData.append('id', String(product.id));
    product.category_id && formData.append('category_id', String(product.category_id));
    product.name && formData.append('name', String(product.name));
    product.price && formData.append('price', String(product.price));
    product.recipe && formData.append('recipe', String(product.recipe));
    product.description && formData.append('description', String(product.description));
    product.passive && formData.append('passive', String(product.passive));
    product.extra && product.extra.length > 0 && formData.append('extra', JSON.stringify(product.extra));
    
    product.images && product.images.forEach((image, index) => {
        image.id && formData.append(`files[${index}][id]`, String(image.id));
        image.file && formData.append(`files[${index}][file]`, image.file);
        image.file && formData.append(`files[${index}][index]`, String(index));
       
    });
    return formData;
};