import useSWR, { mutate, SWRConfiguration } from 'swr';
import { fetcher } from 'lib/utils';
import { tableFetcher } from 'lib/utils/instance';
import { UseTableDataProps } from 'lib/interfaces';

export const useTableData = <T>(params: string) => {
    const { data, error } = useSWR<{ data: UseTableDataProps<T>}>(`/api/${params}`, tableFetcher as SWRConfiguration<{ data: UseTableDataProps<T> }>)
    const { items, total, currentPage, lastPage }: UseTableDataProps<T> = data?.data ?? { items: [], total: 0, currentPage: 0, lastPage: 0 };

    return {
        items,
        total,
        currentPage,
        lastPage,
        isLoading: !error && !data,
        isError: error,
        mutateData: () => mutate(`/api/${params}`),
    };
};
