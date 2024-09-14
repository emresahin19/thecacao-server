import { ColorOptions } from "../../interfaces";

export type IconButtonProps = {
    icon?: string;
    onClick: () => void;
    disabled?: boolean;
    width?: number;
    height?: number;
    children?: React.ReactNode;
    ariaLabel: string;
    className?: string;
};


export type ButtonProps = {
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    property?: 'default' | 'reverse' | 'thin' | 'reverse-thin';
    disabled?: boolean;
    width?: number;
    height?: number;
    label?: string;
    children?: React.ReactNode;
    ariaLabel?: string;
    loading?: boolean;
    color1?: ColorOptions;
    color2?: ColorOptions;
};
