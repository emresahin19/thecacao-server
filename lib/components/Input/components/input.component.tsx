"use client";
import React, { useEffect, useState, forwardRef } from "react";
import EyeIcon from "./eye-icon.component";
import { InputProps } from "../input.props";

const AsimInput = forwardRef<HTMLInputElement, InputProps>(({
    type = "text",
    className = "",
    name,
    label,
    value = '',
    labelColor,
    onChange,
    error = false,
    size = 'md'
}, ref) => {
    const [show, setShow] = useState(false);
    const [inputType, setInputType] = useState<string>(type);

    const toggleShowPassword = () => {
        setShow((prevShow) => !prevShow);
        setInputType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const increment = () => {
        if (onChange) {
            const newValue = (Number(value) || 0) + 1;
            onChange({ target: { value: newValue.toString(), name } } as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const decrement = () => {
        if (onChange) {
            const newValue = (Number(value) || 0) - 1;
            onChange({ target: { value: newValue.toString(), name } } as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const clearValue = () => {
        onChange({ target: { value: '', name } } as React.ChangeEvent<HTMLInputElement>);
    }

    const onTextareaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>);
    }
    
    useEffect(() => {
        setInputType(type);
    }, [type]);

    return (
        <div className={`input-body ${className} ${error ? "error" : ""} ${size}`}>
            {type === "textarea" ? (
                <textarea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    rows={3}
                    name={name}
                    onChange={onTextareaChange}
                    value={value ?? ''}
                />
            ) : (
                <input
                    ref={ref}
                    type={inputType}
                    name={name}
                    onChange={onChange}
                    value={value ?? ''}
                />
            )}
            <label {...labelColor && {style: {color: labelColor}}} >{label}</label>

            {type === "password" && (
                <button
                    className="icon-button i-see-you"
                    type="button"
                    onClick={toggleShowPassword}
                >
                    <EyeIcon show={show} color={'#212529'} />
                </button>
            ) || ''}

            {type === "number" && (
                <div className="number-controls">
                    <span className="increment" onClick={increment}>+</span>
                    <span className="decrement" onClick={decrement}>-</span>
                </div>
            ) || ''}

            {value && (
                <span className={`clear-button ${type}`} onClick={clearValue}>✕</span>
            ) || ''}
        </div>
    );
});

export default AsimInput;
