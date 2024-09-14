import useSWR from 'swr';
import { fetcher } from 'lib/utils';

export const useExtraInputData = () => {
    const { data, error }: {data: any, error: any} = useSWR(`/api/extra/input-data`, fetcher);
    const { items } = data?.data ?? {items: []};

    return {
        extraData: items,
        isLoading: !error && !data,
        isError: error,
    };
};
