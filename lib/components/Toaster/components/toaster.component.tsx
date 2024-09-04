import React, { memo } from 'react';
import { ToasterProps } from '../toaster.props';

const Toaster: React.FC<ToasterProps> = ({toasts = [], closeToast}) => {

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast before-bg-${toast.type}`}>
                    {toast.message}
                    <button type="button" className="close sm" onClick={() => closeToast(toast.id)} />
                </div>
            ))}
        </div>
    
)};

export default memo(Toaster);