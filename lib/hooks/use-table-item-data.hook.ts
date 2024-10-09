import useSWR, { mutate } from 'swr';
import { fetcher } from 'lib/utils';
import { SWRConfiguration } from 'swr';
import { UseItemProps } from 'lib/interfaces';
import { tableFetcher } from 'lib/utils/instance';

export const useItem = <T>({ id, route }: UseItemProps<T>) => {
    if (!id) {
        return { item: null as T | null, isLoading: false, isError: false, mutateProduct: () => {} }
    }
    const { data, error } = useSWR<{ data: { item: T } }>(`/api/${route}/${id}`, tableFetcher as SWRConfiguration<{ data: { item: T } }>)
    
    const { item } = data?.data ?? {};

    return {
        item,
        isLoading: !error && !data,
        isError: !!error,
        mutateProduct: () => mutate(`/api/${route}/${id}`),
    };
};