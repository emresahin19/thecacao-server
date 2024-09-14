import useSWR, { mutate } from 'swr';
import { fetcher, serializeFilters } from 'lib/utils';
import { apiUrl, dashUrl } from 'lib/constants';

export const useCategories = (page = 1, perPage = 10, filters = {}, domain = dashUrl) => {
    const filterQuery = serializeFilters(filters);
    const url = `${domain}/api/categories?page=${page}&perPage=${perPage}&${filterQuery}`;
    const { data, error }: { data: any, error: any } = useSWR(url, fetcher);
    const { items, total, currentPage, lastPage } = data?.data ?? {};
    
    return {
        categories: items,
        total: total,
        currentPage: currentPage,
        lastPage: lastPage,
        isLoading: !error && !data,
        isError: error,
        mutateCategories: () => mutate(url),
    };
};
