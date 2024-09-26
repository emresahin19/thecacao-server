import type { EditableInputProps } from '../input.props';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { dateToString } from 'lib/utils';
import MultipleSelectBox from './multiple-selectbox.component';

const EditableInput: React.FC<EditableInputProps> = ({ name, value, options = [], onChange, onSave, onCancel, type = 'text', render }) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const allowedTypes = useMemo(() => ['text', 'number', 'email', 'password'], []);
    const dateTypes = useMemo(() => ['date', 'time', 'datetime-local'], []);
    const isDate = useMemo(() => dateTypes.includes(type), [dateTypes, type]);
    const isChanged = useRef(false);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback(() => {
        if (isEditing) return;
        setIsEditing(true);
    }, [isEditing]);

    const handleBlur = useCallback(() => {
        if (!isChanged.current) {
            setIsEditing(false);
        }
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (!isChanged.current && e.target.value !== value) {
            isChanged.current = true;
        }
    }, [onChange, value]);

    const handleSaveClick = useCallback(() => {
        setIsEditing(false);
        onSave({ value });
    }, [onSave, value]);

    const handleCancelClick = useCallback(() => {
        setIsEditing(false);
        onCancel();
    }, [onCancel]);

    const formatValueForInput = useCallback((value: string) => {
        if (type === 'datetime-local') {
            const formattedValue = value.replace('.000000Z', '');
            return formattedValue;
        } else if (type === 'date') {
            const formattedValue = value.split('T')[0];
            return formattedValue;
        } else if (type === 'time') {
            const formattedValue = value.split('T')[1].split('.')[0];
            return formattedValue;
        }
        return value;
    }, [type]);

    const displayValue = useMemo(() => {
        if (isDate) {
            return dateToString(value);
        } else if (render) {
            return render;
        }
        return value;
    }, [isDate, render, value]);

    return (
        <div className="editable-input">
            {isEditing ? (
                allowedTypes.includes(type) && (
                    <input
                        type={type}
                        ref={inputRef}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                ) || isDate && (
                    <input
                        ref={inputRef}
                        type={type}
                        name={name}
                        value={formatValueForInput(value)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                ) || (type === 'select' ) && (
                    <MultipleSelectBox
                        label={``}
                        options={options}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                ) || (
                    <div className='input-value ellipsis td-item' onDoubleClick={handleDoubleClick}>
                        {value}
                    </div> 
                )
            ) : (
                <div className='input-value ellipsis td-item' onDoubleClick={handleDoubleClick}>
                    {displayValue}
                </div>
            )}
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
