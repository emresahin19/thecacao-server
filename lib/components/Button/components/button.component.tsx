import { ButtonProps } from '../button.props';
import React from 'react';
import Spinner from '../../Loading/components/spinner.component';

const Button: React.FC<ButtonProps> = ({ 
    children, 
    className = '', 
    onClick, 
    property = 'default', 
    label = '', 
    disabled = false, 
    ariaLabel, 
    loading = false,
    color1, 
    color2 
}) => (
    <button 
        className={`button-${property}  ${color1 && `button1-${color1}` || ''} ${color2 && `button2-${color2}` || ''} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
    >
        {loading && <Spinner size={19} absolute={true} /> || ''}
        <span {...loading && {style: {visibility: 'hidden'}}}>
            {label || children}
        </span>
    </button>
);

export default Button;
