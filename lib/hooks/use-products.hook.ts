import useSWR, { mutate } from 'swr';
import { fetcher, serializeFilters } from 'lib/utils';

export const useProducts = (params: string) => {
    const { data, error }: {data: any, error: any} = useSWR(`/api/products${params}`, fetcher);
    const { items, total, currentPage, lastPage } = data?.data ?? {};
    return {
        data: items,
        total,
        currentPage,
        lastPage,
        isLoading: !error && !data,
        isError: error,
        mutateData: () => mutate(`/api/products${params}`),
    };
};
