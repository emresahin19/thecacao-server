import { InputProps, InputType, OptionsProps, ProductEditTypeProps } from "lib/interfaces";

export type DataRouteProps = 'products' | 'categories' | 'extra' | 'extra-categories';
export type EditTypes = 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'image' | 'sorter';

export interface EditCardProps<T> {
    id: number;
    route: DataRouteProps;
    onSave?: (response: any) => void;
    onCancel?: () => void;
    fields: EditTypeProps<T>[];
    isFormData?: boolean;
}

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    perPage?: number;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    loading?: boolean;
}

export interface ColumnProps<T> {
    key: keyof T | string;
    subKey?: keyof T | string;
    inputKey: string;
    label?: string;
    sort?: boolean;
    defaultSort?: 'ASC' | 'DESC';
    render?: (item: T) => React.ReactNode;
    type?: InputType;
    filterType?: InputType;
    options?: OptionsProps[];
    editable?: boolean;
}

export interface TableProps<T> {
    apiRoute: DataRouteProps;
    className?: string;
    editPage?: string;
    fields: Array<EditTypeProps<T>>;
    onAction?: (item: T, action: 'save' | 'delete') => void;
    isFormData?: boolean;
}

export interface TableViewProps<T> {
    items: T[];
    columns: Array<ColumnProps<T>>;
    className?: string;
    selectedItems:{[key: string]: {id: number; name: string;}};
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
    handleSave: (item: T, key: string, value: any, callback?: (status: boolean) => void) => void;
    handleCancel: (itemId: string) => void;
    isLoading: boolean;
    perPage: number;
}

export interface EditTypeProps<T> {
    key: keyof T;
    subKey?: string;
    label?: string;
    type?: InputType;
    defaultValue?: T[keyof T];
    property: 'edit' | 'view' | 'all' | 'none';
    options?: OptionsProps[];
    required?: boolean;
    sort?: boolean;
    defaultSort?: 'ASC' | 'DESC';
    render?: (item: T) => React.ReactNode;
    filterType?: InputType;
    editable?: boolean;
    inputData?: Array<{
        key: keyof InputProps | keyof HTMLInputElement;
        value?: any;
        dataKey?: keyof T | keyof T[keyof T];
    }>;
}

export interface UseItemProps<T> {
    id: EditCardProps<T>['id'];
    route: EditCardProps<T>['route'];
}

export interface EditFieldProps<T> {
    field: EditTypeProps<T>;
    value: any;
    onChange: (key: string, type: InputType) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setItemData: React.Dispatch<React.SetStateAction<Partial<any>>>;
    inputProps?: {
        [key in keyof InputProps]?: any;
    }
}

export interface UseTableDataProps<T> {
    items: T[];
    total: number;
    currentPage: number;
    lastPage: number;
}
