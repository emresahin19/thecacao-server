import { ModalProps } from "lib/interfaces";
import { ReactNode } from "react";

export interface ModalProviderProps {
    children: ReactNode;
}

export interface ModalContextType {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleShow: ({show, component, route}: ModalProps) => void;
    component?: ReactNode;
    setComponent: (component: ReactNode) => void;
    resetModal: () => void;
}
  