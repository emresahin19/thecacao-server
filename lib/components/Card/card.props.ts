import { CategoryProps, ImageObject, ProductProps } from "../../interfaces";

export interface ProductDetailProps {
    categories: CategoryProps[];
    sliderItems: React.ReactNode[];
    category: CategoryProps;
    product: ProductProps;
}

export type ProductEditProps = {
    id: number | string;
    onSave?: (response: any, callback?: () => void) => void;
    onCancel?: () => void;
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
    name: string;
    order: number;
    color?: string;
    textColor?: string;
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
    