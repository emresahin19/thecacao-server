
export interface ToastProps {
    id: number;
    message: string;
    type: "success" | "danger" | "warning";
}

export interface ToasterProps {
    toasts: ToastProps[];
    closeToast: (id: number) => void;
}