import React, { useState, ReactNode } from 'react';
import { ToastContext } from './toast.context';
import { AxiosError } from 'axios';
import { ShowToastProps } from './toast.props';
import { ToastProps } from '@asim-ui/interfaces';
import { Toaster } from '@asim-ui/components';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = ({message, type = "success", duration = 3000}: ShowToastProps) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
    };

    const closeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const handleRequestError = (err: AxiosError | any) => {
        const { error } = err.response?.data || err.response || err || { error: "Bir hata oluştu!" };
        showToast({ message: error, type: "danger" });
    };
    
    return (
        <ToastContext.Provider value={{ showToast, handleRequestError }}>
            {children}
            <Toaster toasts={toasts} closeToast={closeToast} />
        </ToastContext.Provider>
    );
};
