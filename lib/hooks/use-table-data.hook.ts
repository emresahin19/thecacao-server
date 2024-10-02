import useSWR, { mutate } from 'swr';
import { fetcher } from 'lib/utils';

export const useTableData = (params: string) => {
    const { data, error }: {data: any, error: any} = useSWR(
        () => (params !== '' ? `/api/${params}` : null),
        fetcher
    );
    const { items, total, currentPage, lastPage } = data?.data ?? {};
    return {
        data: items,
        total,
        currentPage,
        lastPage,
        isLoading: !error && !data,
        isError: error,
        mutateData: () => mutate(`/api/${params}`),
    };
};
