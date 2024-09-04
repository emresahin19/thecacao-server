import React, { useState, useRef, useEffect } from 'react';
import ImageInput from './image-input.component';
import { ImageObject, MultipleImageInputProps } from '../input.props';

const MultipleImageInput: React.FC<MultipleImageInputProps> = ({ initialImages, onImagesChange, onChange, onRemove }) => {
    const [images, setImages] = useState<ImageObject[]>(initialImages);
    const [emptyImage, setEmptyImage] = useState<string | null>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleImageChange = (index: number, file: File | null) => {
        const newImages = [...images];
        if (file) {
            newImages[index] = { id: null, file, url: URL.createObjectURL(file) };
        } else {
            newImages.splice(index, 1);
        }
        setImages(newImages);
        onImagesChange(newImages);
    };

    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const handleAddImage = (file: File | null) => {
        if (file) {
            const newImages = [...images, { id: null, file, url: URL.createObjectURL(file) }];
            setImages(newImages);
            onImagesChange(newImages);
            onChange?.(file);
            setEmptyImage(null);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        onImagesChange(newImages);
        onRemove?.();
    };

    const handleDragStart = (index: number) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
        const newImages = [...images];
        const draggedItemContent = newImages[dragItem.current as number];
        if (!draggedItemContent) return;
        newImages.splice(dragItem.current as number, 1);
        newImages.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = dragOverItem.current;
        dragOverItem.current = null;
        setImages(newImages);
        onImagesChange(newImages);
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="multiple-image-input">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="sortable-item"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                >
                    <ImageInput
                        key={index}
                        name={`image-${index}`}
                        value={image.url}
                        onChange={(file) => handleImageChange(index, file)}
                        onRemove={() => handleRemoveImage(index)}
                    />
                </div>
            ))}
            <div className="sortable-item">
                <ImageInput
                    name={`image-${images.length}`}
                    value={emptyImage}
                    disablePreview={true}
                    onChange={handleAddImage}
                />
            </div>
        </div>
    );
};

export default MultipleImageInput;
