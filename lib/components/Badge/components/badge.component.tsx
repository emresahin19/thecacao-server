import React from 'react';
import { BadgeProps } from '../badge.props';

const Badge: React.FC<BadgeProps> = ({ count, color = 'danger' }) => {
    return (
        <div className={`badge bg-${color}`}>
            {count > 0 && <span className="badge-count">{count}</span>}
        </div>
    );
};

export default Badge;