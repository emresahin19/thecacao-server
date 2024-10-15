import React from 'react';
import { CountBadgeProps } from '../badge.props';

const CountBadge: React.FC<CountBadgeProps> = ({ count, color = 'danger' }) => {
    return (
        <div className={`badge bg-${color}`}>
            {<span className="badge-count">{count}</span>}
        </div>
    );
};

export default CountBadge;