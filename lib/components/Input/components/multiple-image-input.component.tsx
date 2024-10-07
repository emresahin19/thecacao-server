import React, { useState, useEffect } from 'react';
import ImageInput from './image-input.component';
import { ImageObject, MultipleImageInputProps } from '../input.props';
import { imageToCdnUrl } from 'lib/utils';
import { productVariantHeight, productVariantWidth } from 'lib/constants';
import DraggableList from '../../DragDrop/components/drag-drop.component';

const MultipleImageInput: React.FC<MultipleImageInputProps> = ({
    initialImages,
    onImagesChange,
    onChange,
    onRemove,
    width = productVariantWidth,
    height = productVariantHeight,
}) => {
    const [images, setImages] = useState<ImageObject[]>(initialImages);
    const [emptyImage, setEmptyImage] = useState<string | null>(null);

    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

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

    const handleReorder = (newImages: ImageObject[]) => {
        setImages(newImages);
        onImagesChange(newImages);
    };

    return (
        <div className='multiple-image-input'>
            <DraggableList
                items={images}
                setItems={handleReorder}
                render={(image: ImageObject, index: number) => {
                    const img = image.filename
                        ? imageToCdnUrl({ image: image.filename, width, height })
                        : image.url;
                    return (
                        <ImageInput
                            name={`image-${index}`}
                            value={img}
                            onChange={(file) => handleImageChange(index, file)}
                            onRemove={() => handleRemoveImage(index)}
                        />
                    );
                }}
            />
            <ImageInput
                className='empty-image-input'
                name={`image-${images.length}`}
                value={emptyImage}
                disablePreview={true}
                onChange={handleAddImage}
            />
        </div>
    );
};

export default MultipleImageInput;
