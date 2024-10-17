import React, { useState } from 'react';
import { ImageInputProps } from '../input.props';

const ImageInput: React.FC<ImageInputProps> = ({
    label,
    name = 'image-input',
    value,
    className,
    onChange,
    onRemove,
    disablePreview = false,
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onChange?.(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Prevent default to allow drop
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Prevent default to handle drop correctly
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            onChange?.(droppedFile);
        }
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onChange?.(null);
        onRemove?.();
    };

    return (
        <div
            className={`image-input ${dragActive ? 'active' : ''} ${className ? className : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id={`${name}-input`}
                name={name}
                style={{ display: 'none' }}
                draggable="false"
                onChange={handleFileChange}
            />
            <label htmlFor={`${name}-input`} className="switch">
                {value && !disablePreview ? (
                    <div className="preview-container">
                        <img src={value} alt="Preview" className="preview" draggable="false" />
                    </div>
                ) : (
                    <>{label || 'Resmi sürükle veya yüklemek için tıkla'}</>
                )}
            </label>
            {value && <button type="button" className="close" onClick={handleRemove} />}
        </div>
    );
};

export default ImageInput;
