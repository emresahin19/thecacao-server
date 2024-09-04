"use client";
import React, { useState, useRef, useEffect } from "react";
import { MultipleSelectBoxProps, OptionsProps } from "../input.props";

const MultipleSelectBox: React.FC<MultipleSelectBoxProps> = ({
    options,
    label,
    className = "",
    name,
    value,
    onChange,
    error = false,
    size = 'md',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isArray = Array.isArray(value);

    const handleOptionClick = (e: React.MouseEvent<HTMLDivElement>, option: OptionsProps) => {
        e.stopPropagation();
        e.preventDefault();
        if(!options) return;

        let newValue = isArray ? [...value] : [value];

        if (isArray) {
            const groupOptionValues = option.options && option.options.map(opt => opt.value) || [];
            const allSelected = groupOptionValues.every(val => newValue.includes(val));

            if (allSelected) {
                newValue = newValue.filter(val => !groupOptionValues.includes(val));
            } else {
                newValue = Array.from(new Set([...newValue, ...groupOptionValues]));
            }
        } else {
            if (option && option.value && newValue.includes(option.value)) {
                newValue = newValue.filter(val => val !== option.value);
            } else {
                newValue = [...newValue, option.value];
            }
        }

        onChange({ target: { value: newValue, name } } as unknown as React.ChangeEvent<HTMLSelectElement>);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const clearValue = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onChange({ target: { value: [], name } } as unknown as React.ChangeEvent<HTMLSelectElement>);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className={`input-body ${className} ${error ? "error" : ""} ${size}`} ref={dropdownRef}>
            <div className="select-box" onClick={() => setIsOpen(!isOpen)} data-value={isArray && value.join(', ') || value}>
                <div className="selected-value">
                    {options && (isArray 
                        ? value.map(val => options.flatMap(opt => 'options' in opt ? opt.options : [opt]).find(option => option && option.value === val)?.label).join(', ') 
                        : value
                    )}
                </div>

                {isOpen && (
                    <div className="options open">
                        {options && options.map(option => {
                            const isActive = 'options' in option && option.options && isArray && option.options.every(opt => value.includes(opt.value));

                            return (
                                <div key={option.value}>
                                    <div
                                        className={`parent-option ${isActive ? 'active' : ''}`}
                                        onClick={(e) => handleOptionClick(e, option)}
                                    >
                                        {option.label}
                                    </div>

                                    {isArray && 'options' in option && option.options && option.options.map(subOption => {
                                        return (
                                            <div
                                                key={subOption.value}
                                                className={`option ${value.includes(subOption.value) ? 'active' : ''}`}
                                                onClick={(e) => handleOptionClick(e, subOption)}
                                            >
                                                {subOption.label}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                )}
                {isArray && value.length > 0 && (
                    <span className="clear-button" onClick={clearValue}>✕</span>
                )}
            </div>
            <label className={`${isArray && value.length > 0 ? "active" : ""}`}>{label}</label>
        </div>
    );
};

export default MultipleSelectBox;
