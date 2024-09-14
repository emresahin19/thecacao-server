import React from 'react';

// Generic SVG component
const SvgIcon = ({ src, ...props }: { src: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }) => {
    const IconComponent = src;
    return <IconComponent {...props} />;
};

export default SvgIcon;
