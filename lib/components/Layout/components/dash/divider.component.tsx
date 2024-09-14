import { DividerProps } from "../../../../interfaces";
import React from "react";

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
    return <div className={`divider ${className}`} />;
};

export default Divider;