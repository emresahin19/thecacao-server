import { ImageObject } from "lib/interfaces";
import { Draft } from "@reduxjs/toolkit";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, RefObject } from "react";

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
  export interface CategoryProps {
    ref?: Draft<RefObject<HTMLDivElement>> | null;
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
    createdAt?: string;
    updatedAt?: string;
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
    category_id: number;
    recipe: string;
    extra?: Array<ExtraProps>;
    images?: Array<ImageObject>;
    cfImages?: Array<any>;
    image_urls?: Array<string>;
    passive: number;
    diy: Array<any> | null;
    order: number;
    textColor?: string;
    listView?: boolean;
    createdAt?: string;
    updatedAt?: string;
    onClick?: (product: ProductProps) => void;
}

export interface ExtraProps {
    name: string;
    price: number;
    image: string;
    order: number;
    passive: number;
    category_name: string;
    createdAt: string;
    updatedAt: string;
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


export interface ImageToCdnUrlProps {
  image: string | null | undefined;
  width?: number;
  height?: number;
  type?: 'product' | 'product-detail' | 'slider' | 'extra';
  quality?: number;
}