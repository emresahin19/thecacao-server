import { InputType } from "lib/interfaces";
import { InputProps, OptionsProps } from "../Input/input.props";

export type DataRouteProps = 'products' | 'categories' | 'extra' | 'extra-category';
export type EditTypes = 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'image';

export interface EditCardProps<T> {
    id: number | string;
    route: DataRouteProps;
    onSave?: (response: any) => void;
    onCancel?: () => void;
    fields: EditTypeProps<T>[];
}

export interface EditTypeProps<T> {
    key: keyof T;
    subKey?: string;
    label: string;
    type: InputType;
    property: 'edit' | 'view' | 'all' | 'none';
    options?: OptionsProps[];
    required?: boolean;
    sort?: boolean;
    defaultSort?: 'ASC' | 'DESC';
    render?: (item: T) => React.ReactNode;
    filterType?: InputType;
    editable?: boolean;
    inputData?: Array<{
        key: string;
        value?: any;
        dataKey?: keyof T;
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
    setFormData: React.Dispatch<React.SetStateAction<Partial<any>>>;
    inputProps?: {
        [key in keyof InputProps]?: any;
    }
}
