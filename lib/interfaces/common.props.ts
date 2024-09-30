import { Draft } from "@reduxjs/toolkit";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, RefObject } from "react";
import { ImageObject } from "../components/Input/input.props";

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'time' | 'datetime-local' | 'select' | 'datetime' | 'textarea' | 'color' | 'file' | 'checkbox' | 'radio';
export type ColorOptions =
  | 'primary'
  | 'secondary'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'black'
  | 'white'
  | 'facebook'
  | 'twitter'
  | 'googleplus'
  | 'instagram'
  | 'pinterest'
  | 'youtube'
  | 'slack'
  | 'dribbble'
  | 'github'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

  export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
  }
  
  export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
  }

  export interface MenuInitialProps {
    items: CategoryProps[] | null;
    contacts: ContactProps | null;
    extraData: ExtraDataProps[] | null;
}

  export interface CategoryProps {
    ref?: Draft<React.RefObject<HTMLDivElement>>;
    id: number;
    index: number;
    name: string;
    slug: string;
    order: number;
    products: ProductProps[];
    image?: string;
    color?: string;
    textColor?: string;
    isActive?: boolean;
    viewType?: 'grid' | 'list' | 'carousel';
    created_at?: string;
    updated_at?: string;
    onProductClick?: ({productSlug} : {productSlug: string}) => void;
    isVisible?: boolean;
  }

  export interface ProductProps {
    id: number;
    loading?: 'eager' | 'lazy';
    category?: CategoryProps;
    name: string;
    slug: string;
    fullpath?: string;
    description: string;
    price: number;
    category_id?: number;
    recipe?: string;
    extra?: Array<number>;
    extras: Array<ExtraDataProps>;
    images?: Array<ImageObject>;
    passive?: number;
    order: number;
    textColor?: string;
    listView?: boolean;
    created_at?: string;
    updated_at?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }

export interface ExtraDataProps {
    id: number;
    name: string;
    description	: number;
    image?: string;
    extras: ExtraProps[];
}

export interface ExtraProps {
    id: number;
    name: string;
    price: number;
    image_url: string;
}

export interface ContactProps {
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    linkedin: string;
}

export interface DividerProps {
    className?: string;
};

export interface RouteProps {
  path: string;
  name: string;
  disabled?: boolean;
  soon?: boolean;
}

export interface HexToRgba {
  (hex: string, opacity: number): string;
}


export interface CustomImageProps {
  image?: string | null | undefined;
  width?: number | null;
  height?: number | null;
  type?: 'product' | 'product-detail' | 'slider' | 'extra';
  format?: 'webp' | 'jpg' | 'png';
  quality?: number | null;
}