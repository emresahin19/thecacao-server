import type { EditableInputProps } from '../input.props';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { dateToString } from 'lib/utils';
import MultipleSelectBox from './multiple-selectbox.component';
import Spinner from 'lib/components/Loading/components/spinner.component';

const EditableInput: React.FC<EditableInputProps> = ({ name, value, options = [], onChange, onSave, onCancel, type = 'text', render }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const allowedTypes = useMemo(() => ['text', 'number', 'email', 'password'], []);
    const dateTypes = useMemo(() => ['date', 'time', 'datetime-local'], []);
    const isDate = useMemo(() => dateTypes.includes(type), [dateTypes, type]);
    const isChanged = useRef(false);
    const lastTapRef = useRef<number>(0);
    
    useEffect(() => {
        if (isEditing && inputRef.current) {
            setInputValue(value);
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleActivateEditMode = useCallback(() => {
        if (isEditing) return;
        setIsEditing(true);
        isChanged.current = false;
    }, [isEditing]);

    const handleBlur = useCallback(() => {
        if (!isChanged.current) {
            setIsEditing(false);
        }
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e);
        if (!isChanged.current && e.target.value !== value) {
            isChanged.current = true;
        }
    }, [onChange, value]);

    const handleSaveResponse = useCallback((status: boolean) => {
        setLoading(false);
        setIsEditing(!status);
    }, []);

    const handleSaveClick = useCallback(() => {
        setLoading(true);
        setIsEditing(false);
        onSave({ value: inputValue, callback: handleSaveResponse });
        isChanged.current = false;
    }, [onSave, inputValue]);

    const handleCancelClick = useCallback(() => {
        setIsEditing(false);
        setInputValue(value); 
        onCancel();
        isChanged.current = false;
    }, [onCancel, value]);

    const formatValueForInput = useCallback((value: string) => {
        if (type === 'datetime-local') {
            const formattedValue = value.replace('.000000Z', '');
            return formattedValue;
        } else if (type === 'date') {
            const formattedValue = value.split('T')[0];
            return formattedValue;
        } else if (type === 'time') {
            const formattedValue = value.split('T')[1]?.split('.')[0] || value;
            return formattedValue;
        }
        return value;
    }, [type]);

    const displayValue = useMemo(() => {
        if (isDate) {
            return dateToString(value);
        } else if (type === 'color') {
            return (
                <div
                    className='color-box'
                    style={{ backgroundColor: value }}
                />
            );
        } else if (render) {
            return render;
        }
        return value;
    }, [isDate, render, value]);

    const handleTouchStart = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_TAP_DELAY) {
            handleActivateEditMode();
            lastTapRef.current = 0;
        } else {
            lastTapRef.current = now;
        }
    }, [handleActivateEditMode]);

    if(loading) {
        return (
            <div className="editable-input">
                <Spinner size={16} />
            </div>
        );
    }

    return (
        <div className="editable-input" onDoubleClick={handleActivateEditMode} onTouchStart={handleTouchStart}>
            {isEditing && 
                (allowedTypes.includes(type) && (
                    <input
                        type={type}
                        ref={inputRef}
                        name={name}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                ) || (isDate && (
                    <input
                        ref={inputRef}
                        type={type}
                        name={name}
                        value={formatValueForInput(inputValue)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                )) || (type === 'select' && (
                    <MultipleSelectBox
                        options={options}
                        name={name}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                )) || (type === 'color' && (
                    <div className="editable-color-input">
                        <input
                            type={type}
                            ref={inputRef}
                            name={name}
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </div>
                ))) || (
                    <div className='input-value ellipsis'>
                        {displayValue}
                    </div> 
                )
            }
            {isEditing && isChanged.current && (
                <div className="button-area">
                    <span 
                        className='save'
                        role='button'
                        onMouseDown={handleSaveClick}
                    >✓</span>
                    <span 
                        className='cancel'
                        role='button'
                        onMouseDown={handleCancelClick}
                    >✕</span>
                </div>
            )}
        </div>
    );
};

export default EditableInput;
