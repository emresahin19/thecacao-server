import React, { useState, useRef, useEffect } from 'react';
import ImageInput from './image-input.component';
import { ImageObject, MultipleImageInputProps } from '../input.props';
import { imageToCdnUrl } from 'lib/utils';
import { productVariantHeight, productVariantWidth } from 'lib/constants';

const MultipleImageInput: React.FC<MultipleImageInputProps> = ({ 
    initialImages, 
    onImagesChange, 
    onChange, 
    onRemove, 
    width = productVariantWidth, 
    height = productVariantHeight 
}) => {
    const [images, setImages] = useState<ImageObject[]>(initialImages);
    const [emptyImage, setEmptyImage] = useState<string | null>(null);

    const [draggedItem, setDraggedItem] = useState<{
        index: number;
        image: ImageObject;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    // Touch Event Handler'ları
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
        e.stopPropagation();

        const touch = e.touches[0];
        const item = itemRefs.current[index];

        if (item) {
            const rect = item.getBoundingClientRect();
            // Dokunma noktası ile öğenin sol üst köşesi arasındaki offset'i hesaplayalım
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - item.offsetTop;

            setDraggedItem({
                index,
                image: images[index],
                x: touch.clientX,
                y: touch.clientY,
                offsetX,
                offsetY,
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!draggedItem) return;

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        // Klon öğenin pozisyonunu güncelle
        setDraggedItem({
            ...draggedItem,
            x: currentX,
            y: currentY,
        });

        // Parmağın hangi öğenin üzerinde olduğunu belirle
        const overIndex = getOverIndex(currentX, currentY);
        if (overIndex !== null && overIndex !== draggedItem.index) {
            // Öğelerin yerini değiştir
            const newImages = [...images];
            const draggedImage = newImages.splice(draggedItem.index, 1)[0];
            newImages.splice(overIndex, 0, draggedImage);
            setImages(newImages);
            onImagesChange(newImages);
            // draggedItem index'ini güncelle
            setDraggedItem({
                ...draggedItem,
                index: overIndex,
            });
        }
    };

    const handleTouchEnd = () => {
        setDraggedItem(null);
    };

    // Parmağın bulunduğu öğenin indeksini bulmak için yardımcı fonksiyon
    const getOverIndex = (x: number, y: number): number | null => {
        for (let i = 0; i < itemRefs.current.length; i++) {
            const item = itemRefs.current[i];
            if (item && i !== draggedItem?.index) {
                const rect = item.getBoundingClientRect();
                if (
                    x > rect.left &&
                    x < rect.right &&
                    y > rect.top &&
                    y < rect.bottom
                ) {
                    return i;
                }
            }
        }
        return null;
    };

    return (
        <div className="multiple-image-input">
            {images.map((image, index) => {
                const img = image.filename ? imageToCdnUrl({ image: image.filename, width, height }) : image.url;
                return (
                    <div
                        key={index}
                        className="sortable-item interactive"
                        ref={(el) => {itemRefs.current[index] = el}}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <ImageInput
                            name={`image-${index}`}
                            value={img}
                            onChange={(file) => handleImageChange(index, file)}
                            onRemove={() => handleRemoveImage(index)}
                        />
                    </div>
                );
            })}
            <div className="sortable-item">
                <ImageInput
                    name={`image-${images.length}`}
                    value={emptyImage}
                    disablePreview={true}
                    onChange={handleAddImage}
                />
            </div>
            {draggedItem && (
                <div
                    className="sortable-item dragged-clone"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        transform: `translate(${draggedItem.x - draggedItem.offsetX}px, ${draggedItem.y - draggedItem.offsetY}px)`,
                        pointerEvents: 'none',
                        opacity: 0.8,
                        zIndex: 1000,
                    }}
                >
                    <ImageInput
                        name={`image-dragged`}
                        value={draggedItem.image.filename ? imageToCdnUrl({ image: draggedItem.image.filename, width, height }) : draggedItem.image.url}
                        onChange={() => {}}
                        onRemove={() => {}}
                    />
                </div>
            )}
        </div>
    );
};

export default MultipleImageInput;
