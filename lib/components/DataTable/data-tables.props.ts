import { InputType } from "lib/interfaces";
import { OptionsProps } from "../Input/input.props";

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
    tableOrder?: number;
    editOrder?: number;
    options?: OptionsProps[];
    required?: boolean;
    width?: number;
    height?: number;
    sort?: boolean;
    defaultSort?: 'ASC' | 'DESC';
    render?: (item: T) => React.ReactNode;
    filterType?: InputType;
    editable?: boolean;
    inputData?: Partial<Record<keyof HTMLInputElement, any>>;
}

export interface UseItemProps<T> {
    id: EditCardProps<T>['id'];
    route: EditCardProps<T>['route'];
}