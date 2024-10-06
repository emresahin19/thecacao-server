import React, { useState, useEffect } from 'react';
import { ImageInputProps } from '../input.props';

const ImageInput: React.FC<ImageInputProps> = ({ label, name, value, className, onChange, onRemove, disablePreview = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);

    useEffect(() => {
        !disablePreview && setPreview(value || null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            !disablePreview && setPreview(URL.createObjectURL(selectedFile));
            onChange?.(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            !disablePreview && setPreview(URL.createObjectURL(droppedFile));
            onChange?.(droppedFile);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const inputElement = document.getElementById(`${name}-input`) as HTMLInputElement;
        inputElement.click();
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
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
                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview" draggable="false" />
                    </div>
                ) : (
                    <>{label || 'Resmi sürükle veya yüklemek için tıkla'}</>
                )}
            </label>

            {/* {!disablePreview && file && <div className="file-info">{file.name}</div>} */}
            {preview && <button type="button" className="close" onClick={handleRemove} />}
        </div>
    );
};

export default ImageInput;
