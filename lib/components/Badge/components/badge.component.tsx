import React from 'react';
import { BadgeProps } from '../badge.props';

const Badge: React.FC<BadgeProps> = ({ children, color, onRemove }) => {
    return (
        <div className={`badge ${color && `bg-${color}` || ''}`}>
            <span className="badge-item">{children}</span>
            <button 
                className="clear"
                onClick={onRemove}
            >✕</button>
        </div>
    );
};

export default Badge;