import { EditTypeProps, InputType, OptionsProps, ProductEditTypeProps } from "lib/interfaces";

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
    subKey?: keyof T | string;
    inputKey: string;
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
    apiRoute: string;
    className?: string;
    editPage?: string;
    fields: Array<EditTypeProps<T>>;
    onAction?: (item: T, action: 'save' | 'delete') => void;
}

export interface TableViewProps<T> {
    items: T[];
    columns: Array<ColumnProps<T>>;
    className?: string;
    selectedItems: { [key: string]: boolean };
    selectAll: boolean;
    orderBy: string;
    orderDirection: string;
    filters: { [key: string]: any };
    handleSelectItem: (e: React.ChangeEvent<HTMLInputElement>, item: T | null) => void;
    handleSelectAllItems: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterChange: (key: string, value: any) => void;
    handleSort: (key: string) => void;
    handleRowAction: (action: string, item: T | null) => void;
    editValues: { [key: string]: any };
    onEditInputChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        itemId: string,
        key: string
    ) => void;
    handleSave: (item: T, key: string, value: any) => void;
    handleCancel: (itemId: string) => void;
    isLoading: boolean;
    perPage: number;
}


export interface UseTableDataProps<T> {
    items: T[];
    total: number;
    currentPage: number;
    lastPage: number;
}
