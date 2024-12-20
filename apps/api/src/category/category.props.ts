
export interface CategoryQueryParams {
    page?: number;
    perPage?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    name?: string;
    updated_at?: string;
}
