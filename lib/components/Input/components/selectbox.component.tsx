"use client";
import React, { useState, useRef, useEffect } from "react";
import { MultipleSelectBoxProps, OptionsProps } from "../input.props";

const SelectBox: React.FC<MultipleSelectBoxProps> = ({
    options,
    label,
    className = "",
    name,
    value,
    onChange,
    error = false,
    size = 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: OptionsProps) => {
        onChange({ target: { value: option.value, name } } as React.ChangeEvent<HTMLSelectElement>);
        setIsOpen(false);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const clearValue = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onChange({ target: { value: '', name } } as React.ChangeEvent<HTMLSelectElement>);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);
    
    return (
        <div className={`input-body ${className} ${error ? "error" : ""} ${size}`} ref={dropdownRef}>
            <div className="select-box" 
                onClick={() => setIsOpen(!isOpen)} 
                data-value={value || ''}
            >
                <div className="selected-value">
                    {value && options && options.find(option => option.value === value)?.label || ''}
                </div>
                <div className={`options ${isOpen ? "open" : ""}`}>
                    {options && options.map(option => (
                        <div
                            key={option.value}
                            className={`option ${value === option.value ? 'active' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
                {value && (
                    <span className="clear-button" onClick={clearValue}>✕</span>
                ) || ''}
            </div>
            <label className={`${value ? "active" : ""}`}>{label}</label>
        </div>
    );
};

export default SelectBox;
