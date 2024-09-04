import { ColorOptions, InputSize, InputType } from "@asim-ui/interfaces";
import { ChangeEvent } from "react";

export interface CheckboxProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    id: string;
    name: string;
    checked?: boolean;
};

export interface InputProps {
    className?: string;
    name: string;
    label: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    color1?: ColorOptions;
    color2?: ColorOptions;
    labelColor?: string;
    size?: InputSize;
    type?: InputType;
};

export interface EditableInputProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    type?: InputType;
}

export interface ImageInputProps {
    label?: string;
    name?: string;
    value?: string | null;
    onChange?: (file: File | null) => void;
    onRemove?: () => void;
    disablePreview?: boolean;
};

export interface EyeIconProps {
    show: boolean;
    color: string;
};

export interface OptionsProps {
    label: string | number;
    value: string | number;
    options: OptionsProps[] | null;
}

export interface MultipleSelectBoxProps {
    options: OptionsProps[] | null;
    label: OptionsProps['label'];
    value: OptionsProps['value'] | OptionsProps['value'][];
    className?: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export interface TogglerProps {
    label?: string
    value?: boolean
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}


export interface ImageObject {
    id: string | null;
    file: File | null;
    url: string;
};

export interface MultipleImageInputProps {
    initialImages: ImageObject[];
    onImagesChange: (images: ImageObject[]) => void;
    variant?: string;
    onChange?: (file: File | null) => void;
    onRemove?: () => void;
};
