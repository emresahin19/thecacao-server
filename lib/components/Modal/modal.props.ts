import { ReactNode } from "react";

export interface ModalInitialProps {
    blurrable?: boolean;
    openOnMount?: boolean;
    onClose?: () => void;
    initialData?: ModalProps;
}
  
export interface ModalProps {
    show: boolean; 
    component?: ReactNode;
    data?: any;
    route?: string;
    backRoute?: string;
}

export interface DeleteModalProps {
    id: string;
    onSave: () => void;
    onCancel: () => void;
    itemName?: string | null;
    route?: string;
    action?: string;
};

export interface ActionModalProps {
    item: any;
    route: string;
    action: string;
    onSave: () => void;
    onCancel: () => void;
};
