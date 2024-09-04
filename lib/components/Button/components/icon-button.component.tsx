import React from 'react';
import { IconImage } from '@asim-ui/components';
import { IconButtonProps } from '../button.props';


const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, disabled = false, width=16, height=width, children, ariaLabel, className }) => {
    return (
        <button 
            className={`icon-button ${className}`}
            onClick={onClick} 
            disabled={disabled} 
            role="button"
            aria-label={ariaLabel}
        >
            {children}
            {icon && <IconImage src={icon} width={width} height={height} />}
        </button>
    );
};

export default IconButton;