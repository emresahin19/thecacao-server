import React from "react";
import Input from "../../Input/components/input.component";

import MultipleImageInput from "../../Input/components/multiple-image-input.component";
import MultipleSelectBox from "../../Input/components/multiple-selectbox.component";

import { EditFieldProps, ImageObject } from "lib/interfaces";
import RangeInput from "lib/components/Input/components/range-input.component";
import lodash from "lodash";

const EditField = <T extends {  }>({ field, value, onChange, setFormData, inputProps }: EditFieldProps<T>) => {
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

        case 'image':
            return (
                <MultipleImageInput
                    key={key}
                    initialImages={value as ImageObject[]}
                    onImagesChange={(images) => {
                        setFormData((prevFormData) => {
                            const newFormData = { ...prevFormData };
                            lodash.set(newFormData, key, images);
                            return newFormData;
                        });
                    }}
                />
            );

        default:
            return null;
    }
};

export default EditField;