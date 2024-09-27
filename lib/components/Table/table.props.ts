import { InputType, OptionsProps } from "lib/interfaces";

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export interface ColumnProps<T> {
    key: keyof T | string;
    label: string;
    sort?: boolean;
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
}
  