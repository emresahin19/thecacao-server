import useSWR from 'swr';
import { fetcher } from 'lib/utils';

export const useCategoryInputData = () => {
    const { data, error }: {data: any, error: any} = useSWR(`/api/categories/input-data`, fetcher);
    const { items } = data?.data ?? {items: []};
    
    return {
        categories: items,
        isLoading: !error && !data,
        isError: error,
    };
};
