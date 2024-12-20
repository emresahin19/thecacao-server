import React from "react";
import Input from "../../Input/components/input.component";

import MultipleImageInput from "../../Input/components/multiple-image-input.component";
import MultipleSelectBox from "../../Input/components/multiple-selectbox.component";

import { CardStyleProps, EditFieldProps, ImageObject } from "lib/interfaces";
import RangeInput from "lib/components/Input/components/range-input.component";
import lodash from "lodash";
import EditableMenuCard from "lib/components/Card/components/editable-menu-card.component";
import ImageInput from "lib/components/Input/components/image-input.component";
import { imageToCdnUrl } from "lib/utils";

const EditField = <T extends {  }>({ field, value, onChange, setItemData, inputProps }: EditFieldProps<T>) => {
    const key = field.subKey ? `${String(field.key)}.${field.subKey}` : String(field.key);

    switch (field.type) {
        case 'text':
        case 'number':
        case 'textarea':
        case 'color':
            return (
                <Input
                    key={key}
                    type={field.type}
                    name={key}
                    label={field.label}
                    value={value as string | number}
                    onChange={onChange(key, field.type)}
                    {...inputProps}
                />
            );

        case 'range':
            return (
                <RangeInput
                    key={key}
                    name={key}
                    className="interactive"
                    label={field.label}
                    value={value as number}
                    onChange={onChange(key, field.type)}
                    {...inputProps}
                />
            );

        case 'select':
        case 'multiselect':
            if (!field.options || field.options.length === 0) return null;
            
            return (
                <MultipleSelectBox
                    key={key}
                    name={key}
                    label={field.label}
                    options={field.options}
                    value={value as string[] | number[] | string | number}
                    onChange={onChange(key, field.type)}
                />
            );

        case 'images':
            return (
                <MultipleImageInput
                    key={key}
                    initialImages={value as ImageObject[]}
                    onImagesChange={(images) => {
                        setItemData((prevItemData) => {
                            const newItemData = { ...prevItemData };
                            lodash.set(newItemData, key, images);
                            return newItemData;
                        });
                    }}
                />
            );
    
        case 'image':
            const { id, file, filename, url } = value as ImageObject || {};
            const src = url ? url : filename ? imageToCdnUrl({ image: filename, width: 150, height: 150 }) : null;
            return (
                <ImageInput
                    value={src}
                    onChange={(file: File | null) => {
                        if(!file) return;
                        return setItemData((prevItemData) => {
                            const newItemData = { ...prevItemData };
                            const imgObj = file ? { ...value, file, filename: file.name, url: URL.createObjectURL(file) } : null;
                            lodash.set(newItemData, key, imgObj);
                            return newItemData;
                        });
                    }}
                />
            );

        case 'sorter':
            if(!inputProps || !Array.isArray(value)) return null;
            const { style } = inputProps as { style: CardStyleProps };
            return (
                <EditableMenuCard
                    title="Ürünler"
                    items={value}
                    style={style}
                    setItems={
                        (items) => {
                            setItemData((prevItemData) => {
                                const newItemData = { ...prevItemData };
                                lodash.set(newItemData, key, items);
                                return newItemData;
                            });
                        }
                    }
                />
            )

        default:
            return null;
    }
};

export default EditField;