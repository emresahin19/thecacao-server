import { CategoryProps, ImageObject, OptionsProps, ProductProps } from "../../interfaces";

export interface CardStyleProps {
    color: string;
    backgroundColor: string;
    opacity: number;
}
export interface ProductDetailProps {
    categories: CategoryProps[];
    sliderItems: React.ReactNode[];
    category: CategoryProps;
    product: ProductProps;
}

export type ProductEditProps = {
    id: number | string;
    onSave?: (response?: any) => void;
    onCancel?: () => void;
    closed?: boolean;
    editFields?: Array<ProductEditTypeProps>;
};

export interface CategoryDetailProps {
    categories: CategoryProps[]; 
    selectedCategory: CategoryProps;
}
  
export type CategoryEditProps = {
    id: number | string;
    onSave?: (response: any) => void;
    onCancel?: () => void;
};


export interface CategoryDataProps {
    id?: number | string;
    style?: CardStyleProps;
    name: string;
    order: number;
    passive?: number; 
    deleted?: boolean;
}

export interface ProductDataProps {
    id?: number | string;
    category_id: number;
    name: string;
    price: number;
    recipe?: string;
    description?: string;
    images?: ImageObject[];
    extra?: number[] | string[];
    diy?: number[];
    passive?: number;
    deleted?: boolean;
}

export interface EditableMenuCardProps {
    items: ProductProps[];
    setItems: React.Dispatch<React.SetStateAction<ProductProps[]>>;
    style: CardStyleProps;
    title?: string;
}

export interface ProductEditTypeProps {
    key: 'name' | 'category_id' | 'price' | 'description' | 'recipe' | 'extra' | 'images';
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'image';
    options?: OptionsProps[];
    required?: boolean;
    width?: number;
    height?: number;
}

export interface ExportProps<T> {
    items: {[key: string]: {id: number; name: string;}};
    route: string;
    onSave?: (response: any) => void;
    onCancel?: () => void;
}
