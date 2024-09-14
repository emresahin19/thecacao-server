import React from 'react';
import { IconButtonProps } from '../button.props';


const CloseButton: React.FC<IconButtonProps> = ({ onClick, disabled = false, children, ariaLabel, className }) => {
    return (
        <button 
            className={`close ${className || ''}`}
            onClick={onClick} 
            disabled={disabled} 
            role="button"
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};

export default CloseButton;