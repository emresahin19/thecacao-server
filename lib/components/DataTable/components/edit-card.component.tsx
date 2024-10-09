import React, { useEffect, useState } from "react";
import Input from "../../Input/components/input.component";
import Button from "../../Button/components/button.component";
import Spinner from "../../Loading/components/spinner.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import MultipleImageInput from "../../Input/components/multiple-image-input.component";
import MultipleSelectBox from "../../Input/components/multiple-selectbox.component";
import lodash from 'lodash';

import { useItem } from "../../../hooks";
import { useToast } from "../../../contexts";
import { saveItem } from '../../../services';
import { AxiosError } from "axios";
import { EditCardProps, EditTypeProps } from "../data-tables.props";
import { ImageObject, InputType } from "lib/interfaces";
import RangeInput from "lib/components/Input/components/range-input.component";

const EditCard = <T extends object>({ id, route, fields, onSave, onCancel }: EditCardProps<T>) => {
    const emptyItem = fields.reduce((acc, item) => {
        const key = item.subKey ? `${String(item.key)}.${item.subKey}` : item.key as keyof T;
        return { ...acc, [key]: item.type === 'multiselect' ? [] : '' };
    }, {} as Partial<T>);

    const [initialItem, setInitialItem] = useState<Partial<T> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<T>>(emptyItem);
    const { item, isError, isLoading, mutateProduct } = id ? useItem<T>({ id, route }) : { item: emptyItem, isError: false, isLoading: false, mutateProduct: () => {} };
    const { showToast, handleRequestError } = useToast();

    useEffect(() => {
        if (isError) {
            showToast({ message: 'Ürün bilgileri alınamadı.', type: 'danger' });
        }
    }, [isError]);

    useEffect(() => {
        if (item && !initialItem) {
            setInitialItem(item);
            setFormData(item);
        }
    }, [item, initialItem]);

    const handleSave = async () => {
        if (!item) return;
        setLoading(true);
        try {
            const { data } = await saveItem<T>({ id, route, data: formData as T });
            const { status, message }: { status: string, message: string } = data as any;

            showToast({ message, type: status ? 'success' : 'danger' });
            onSave && onSave(status);
        } catch (error: AxiosError | any) {
            handleRequestError(error);
        } finally {
            setLoading(false);
            mutateProduct();
        }
    };

    const handleReset = () => {
        if (initialItem) {
            setFormData(initialItem);
        }
        onCancel && onCancel();
    };

    const handleInputChange = (key: string, type: InputType) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        let value: any = e.target.value;
        console.log({[key]: value});
        if (type === 'number') {
            value = Number(value);
        } else if (type === 'multiselect') {
            value = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) => option.value);
        }

        setFormData((prevFormData) => {
            const newFormData = { ...prevFormData };
            lodash.set(newFormData, key, value); // Use lodash.set to handle sub-keys
            return newFormData;
        });
    };

    if (isLoading) {
        return (
            <div className="edit-section modal-loading">
                <Spinner absolute={true} />
            </div>
        );
    }

    return (
        <div className="edit-section">
            <div className="modal-custom-header">
                <h3>{id === 0 ? 'Yeni Ürün Ekle' : `Düzenle`}</h3>

                <button
                    className="close"
                    onClick={handleReset}
                    role="button"
                    aria-label="Pencereyi Kapat"
                >
                    Kapat
                </button>
            </div>

            <DashDivider />

            {fields && fields.map(({ key, subKey, type, label, options, required, width, height, inputData }: EditTypeProps<T>) => {
                const fullKey = subKey ? `${String(key)}.${subKey}` : String(key);
                const value = lodash.get(formData, fullKey);

                switch (type) {
                    case 'text':
                    case 'number':
                    case 'textarea':
                    case 'color':
                        return (
                            <div className="edit-input" key={fullKey}>
                                <Input
                                    type={type}
                                    name={fullKey}
                                    label={label}
                                    value={value as string | number}
                                    onChange={handleInputChange(fullKey, type)}
                                />
                            </div>
                        );

                    case 'range':
                        const { min, max, step } = inputData as unknown as { min: number, max: number, step: number };
                        return (
                            <div className="edit-input" key={fullKey}>
                                <RangeInput
                                    name={fullKey}
                                    label={label}
                                    value={value as number}
                                    onChange={handleInputChange(fullKey, type)}
                                    min={min}
                                    max={max}
                                    step={step}
                                />
                            </div>
                        );

                    case 'select':
                    case 'multiselect':
                        if (!options || options.length === 0) return null;
                        return (
                            <div className="edit-input" key={fullKey}>
                                <MultipleSelectBox
                                    name={fullKey}
                                    label={label}
                                    options={options}
                                    value={value as string[] | number[] | string | number}
                                    onChange={handleInputChange(fullKey, type)}
                                />
                            </div>
                        );

                    case 'image':
                        return (
                            <div className="edit-input" key={fullKey}>
                                <MultipleImageInput
                                    initialImages={value as ImageObject[]}
                                    onImagesChange={(images) => setFormData((prevFormData) => {
                                        const newFormData = { ...prevFormData };
                                        lodash.set(newFormData, fullKey, images);
                                        return newFormData;
                                    })}
                                    width={width}
                                    height={height}
                                />
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            <div className="edit-input button-area">
                <Button
                    onClick={handleReset}
                    color1="danger"
                    color2="white"
                >
                    İptal
                </Button>

                <Button
                    property="reverse"
                    onClick={handleSave}
                    loading={loading}
                    color1="success"
                    color2="white"
                >
                    Kaydet
                </Button>
            </div>

        </div>
    );
};

export default EditCard;
