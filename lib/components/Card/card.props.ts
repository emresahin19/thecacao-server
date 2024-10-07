import { CategoryProps, ImageObject, ProductProps } from "../../interfaces";

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
    setItems: (items: ProductProps[]) => void;
    style: CardStyleProps;
    title?: string;
}