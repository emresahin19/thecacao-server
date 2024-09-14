import type { EditableInputProps } from '../input.props';
import React, { useState, useRef, useEffect } from 'react';
import { dateToString } from 'lib/utils';

const EditableInput: React.FC<EditableInputProps> = ({ name, value, onChange, onSave, onCancel, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const allowedTypes = ['text', 'number', 'email', 'password'];
    const dateTypes = ['date', 'time', 'datetime-local'];

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const formatValueForInput = (value: string) => {
        if (type === 'datetime-local') {
            // Convert "2024-07-08T17:58:29.000000Z" to "2024-07-08T17:58"
            const formattedValue = value.replace('.000000Z', '');
            return formattedValue;
        } else if (type === 'date') {
            // Convert "2024-07-08T17:58:29.000000Z" to "2024-07-08"
            const formattedValue = value.split('T')[0];
            return formattedValue;
        } else if (type === 'time') {
            // Convert "2024-07-08T17:58:29.000000Z" to "17:58:29"
            const formattedValue = value.split('T')[1].split('.')[0];
            return formattedValue;
        }
        return value;
    };

    return (
        <div className="editable-input">
            {isEditing ? (
                allowedTypes.includes(type) && (
                    <input
                        type={type}
                        ref={inputRef}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={handleBlur}
                    />
                ) || dateTypes.includes(type) && (
                    <input
                        ref={inputRef}
                        type={type}
                        name={name}
                        value={formatValueForInput(value)}
                        onChange={onChange}
                        onBlur={handleBlur}
                    />
                ) || type === 'select' && (
                    <></> 
                ) || (
                    <div className='input-value ellipsis td-item' onDoubleClick={handleDoubleClick}>
                        {value}
                    </div> 
                )
            ) : (
                <div className='input-value ellipsis td-item' onDoubleClick={handleDoubleClick}>
                    {dateTypes.includes(type) ? dateToString(value) : value}
                </div>
            )}
            {isEditing && (
                <div className="button-area">
                    <span 
                        className='save'
                        role='button'
                        onMouseDown={onSave}
                    >✓</span>
                    <span 
                        className='cancel'
                        role='button'
                        onMouseDown={onCancel}
                    >✕</span>
                </div>
            )}
        </div>
    );
};

export default EditableInput;
