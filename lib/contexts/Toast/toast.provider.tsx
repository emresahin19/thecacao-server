import React, { useState, ReactNode } from 'react';
import { ToastContext } from './toast.context';
import { AxiosError } from 'axios';
import { ShowToastProps } from './toast.props';
import { ToastProps } from 'lib/interfaces';
import Toaster from 'lib/components/Toaster/components/toaster.component'; 

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = ({message, type = "success", duration = 3000}: ShowToastProps) => {
        const id = Date.now() + Math.random();
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
        const errors = Array.isArray(error) ? error : [error];
        errors.forEach((err: string) => showToast({ message: err, type: "danger", duration: errors.length*3000 }));
    };
    
    return (
        <ToastContext.Provider value={{ showToast, handleRequestError }}>
            {children}
            <Toaster toasts={toasts} closeToast={closeToast} />
        </ToastContext.Provider>
    );
};
