import React, { memo } from 'react';
import { SkeletonProps } from '../skeleton.props';

const Skeleton: React.FC<SkeletonProps> = ({ className = '', style, width, height, borderRadius }) => {
    const _width = 
        width &&
        typeof width === 'string' 
            ? width 
            : `${width}px`;

    const _height = 
        height &&
        typeof height === 'string' 
            ? height 
            : `${height}px`;

    const styles = {
        borderRadius: borderRadius && `${borderRadius}px` || '4px',
        ...style,
        ...width && { width: _width },
        ...height && { height: _height },
    };

    return <div className={`skeleton ${className}`} style={styles}></div>;
};

export default memo(Skeleton);