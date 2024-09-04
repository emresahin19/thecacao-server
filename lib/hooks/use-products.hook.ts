import useSWR, { mutate } from 'swr';
import { fetcher, serializeFilters } from '@asim-ui/utils';

export const useProducts = (page = 1, perPage = 10, filters = {}) => {
    const filterQuery = serializeFilters(filters);
    const { data, error }: {data: any, error: any} = useSWR(`/api/products?page=${page}&perPage=${perPage}&${filterQuery}`, fetcher);
    const { items, total, currentPage, lastPage } = data?.data ?? {};
    return {
        products: items,
        total: total,
        currentPage: currentPage,
        lastPage: lastPage,
        isLoading: !error && !data,
        isError: error,
        mutateProduct: () => mutate(`/api/products?page=${page}&perPage=${perPage}&${filterQuery}`), // Manual refetch function
    };
};
