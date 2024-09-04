import { ReactNode } from "react";

export interface ModalInitialProps {
    blurrable?: boolean;
}
  
export interface ModalProps {
    show: boolean; 
    component?: ReactNode;
    route?: string;
}

export interface DeleteModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    itemName?: string | null;
};
