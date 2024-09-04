
export interface ToastContextProps {
    showToast: ({message, type, duration}: ShowToastProps) => void;
    handleRequestError: (err: any) => void;
}

export interface ShowToastProps {
    message: string, 
    type?: "success" | "danger" | "warning", 
    duration?: number
}