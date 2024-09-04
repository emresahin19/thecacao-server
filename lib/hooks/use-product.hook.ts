import useSWR, { mutate } from 'swr';
import { fetcher } from '@asim-ui/utils';

export const useProduct = (id: number | string | null) => {
    if(!id) return { product: null, isLoading: false, isError: false, mutateProduct: () => {} };
    
    const { data, error }: {data: any, error: any} = useSWR(`/api/products/${id}`, fetcher);
    const { item } = data?.data ?? {};
    return {
        product: item,
        isLoading: !error && !data,
        isError: error,
        mutateProduct: () => mutate(`/api/products/${id}`), // Manual refetch function
    };
};
