export interface ProductQueryParams {
    page?: number;
    perPage?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    name?: string;
    updated_at?: string;
    category_id?: number;
    price?: number;
}
