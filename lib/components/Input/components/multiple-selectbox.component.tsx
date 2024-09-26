"use client";
import React, { useState, useRef, useEffect } from "react";
import { MultipleSelectBoxProps, OptionsProps } from "../input.props";

const MultipleSelectBox: React.FC<MultipleSelectBoxProps> = ({
    options = [],
    label,
    className = "",
    name,
    value,
    onChange,
    onBlur,
    error = false,
    size = "md",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isMultiple = Array.isArray(value);

    const flattenOptions = (opts: OptionsProps[]): OptionsProps[] =>
        opts.flatMap((opt) =>
            opt.options ? flattenOptions(opt.options) : opt
        );

    const getSelectedLabels = () => {
        const allOptions = options ? flattenOptions(options) : [];
        if (isMultiple) {
            return allOptions
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ");
        } else {
            const selectedOption = allOptions.find((opt) => opt.value == value);
            return selectedOption ? selectedOption.label : "";
        }
    };

    const handleOptionToggle = (
        e: React.MouseEvent<HTMLInputElement>,
        selectedOption: OptionsProps
    ) => {
        e.stopPropagation();
        e.preventDefault();

        let newValue;
        if (isMultiple) {
            if (selectedOption.options) {
                const groupValues = flattenOptions([selectedOption]).map((opt) => opt.value);
                const allSelected = groupValues.every((val) => value.includes(val));

                newValue = allSelected
                    ? value.filter((val) => !groupValues.includes(val))
                    : Array.from(new Set([...value, ...groupValues]));
            } else {
                // Toggle single option
                newValue = value.includes(selectedOption.value)
                    ? value.filter((val) => val !== selectedOption.value)
                    : [...value, selectedOption.value];
            }
        } else {
            newValue = selectedOption.value;
            setIsOpen(false);
        }

        onChange({
            target: { value: newValue, name },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            onBlur && onBlur({ target: { name, value } } as React.FocusEvent<HTMLInputElement>);
        }
    };

    const clearValue = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const newValue = isMultiple ? [] : "";
        onChange({target: { value: newValue, name }} as React.ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

  const renderOptions = (opts: OptionsProps[]) =>
    opts.map((option) => {
        const isGroup = !!option.options;
        const isSelected = isMultiple
            ? isGroup
                ? option.options!.every((opt) => value.includes(opt.value))
                : value.includes(option.value)
            : value == option.value;

        return (
            <div key={option.value || option.label}>
                <div
                    className={`option ${isSelected ? "active" : ""} ${isGroup ? "parent-option" : ""}`}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => handleOptionToggle(e, option)}
                >
                    {option.label}
                </div>
                {isGroup && (
                    <div className="sub-options">
                        {renderOptions(option.options!)}
                    </div>
                )}
            </div>
        );
    });

    return (
        <div
            className={`input-body ${className} ${error ? "error" : ""} ${size} ${isOpen ? 'open' : ''}`}
            ref={dropdownRef}
        >
            <div
                className="select-box"
                onClick={() => setIsOpen(!isOpen)}
                data-value={getSelectedLabels()}
            >
                <div className="selected-value">{getSelectedLabels()}</div>

                {isOpen && options && <div className="options">{renderOptions(options)}</div>}

                {((isMultiple && value.length > 0) || (!isMultiple && value)) && (
                    <span className="clear-button" onClick={clearValue}>
                        ✕
                    </span>
                ) || null}
            </div>
            <label className={`${isMultiple && value.length > 0 ? "active" : ""}`}>
                {label}
            </label>
        </div>
    );
};

export default MultipleSelectBox;
