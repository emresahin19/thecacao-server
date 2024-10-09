"use client";
import React, { forwardRef } from "react";
import { RangeInputProps } from "../input.props";

const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(({
    className = "",
    name,
    label,
    value = '',
    onChange,
    error = false,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
}, ref) => {

    return (
        <div className={`input-body range-input ${className} ${error ? "error" : ""} ${size}`}>
            <input
                ref={ref}
                type='range'
                name={name}
                onChange={onChange}
                value={value ?? ''}
                min={min} 
                max={max}
                step={step}
            />
            {label && <label>{label}</label>}

        </div>
    );
});

export default RangeInput;
