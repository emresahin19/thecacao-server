import { InputType, OptionsProps } from "@asim-ui/interfaces";

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export interface ColumnProps<T> {
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
    type?: InputType;
    filterType?: InputType;
    options?: OptionsProps[];
    editable?: boolean;
}
  
export interface TableProps<T> {
    data: T[];
    columns: Array<ColumnProps<T>>;
    onRowAction?: (action: string, item: T | null) => void;
    onPageChange?: (page: number) => void;
    currentPage: number;
    perPage: number;
    totalItems: number;
    loading?: boolean;
    className?: string;
    onFilterChange?: (filters: { [key: string]: any }) => void;
}
  