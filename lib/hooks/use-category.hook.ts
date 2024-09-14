import useSWR, { mutate } from 'swr';
import { fetcher } from 'lib/utils';

export const useCategory = (id: number | string | null) => {
    if (!id) return { category: null, isLoading: false, isError: false, mutateCategory: () => {} };
    const { data, error }: { data: any, error: any } = useSWR(`/api/categories/${id}`, fetcher);
    const { item } = data?.data ?? {};
    return {
        category: item,
        isLoading: !error && !data,
        isError: error,
        mutateCategory: () => mutate(`/api/categories/${id}`), // Manual refetch function
    };
};
