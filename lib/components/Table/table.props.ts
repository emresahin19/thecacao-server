import { InputType, OptionsProps } from "lib/interfaces";

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    loading?: boolean;
}

export interface ColumnProps<T> {
    key: keyof T | string;
    label: string;
    sort?: boolean;
    defaultSort?: 'ASC' | 'DESC';
    render?: (item: T) => React.ReactNode;
    type?: InputType;
    filterType?: InputType;
    options?: OptionsProps[];
    editable?: boolean;
}
  
export interface TableProps<T> {
    columns: Array<ColumnProps<T>>;
    dataHook: (filterParams: string) => { data: T[]; total: number; isLoading: boolean; isError: any; mutateData: () => void };
    className?: string;
    editPage?: string;
    apiRoute?: string;
    onAction?: (item: T, action: 'save' | 'delete') => void;
}
