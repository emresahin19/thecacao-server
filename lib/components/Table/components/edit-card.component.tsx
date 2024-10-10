import React, { useEffect, useState, useMemo, useCallback } from "react";
import lodash from 'lodash';
import { AxiosError } from "axios";
import Button from "../../Button/components/button.component";
import Spinner from "../../Loading/components/spinner.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import EditField from "./edit-field.component";
import { useItem } from "../../../hooks";
import { useToast } from "../../../contexts";
import { saveItem } from '../../../services';
import { EditCardProps, EditTypeProps, InputType } from "lib/interfaces";

const EditCard = <T extends object>({ id, route, fields, onSave, onCancel, isFormData = false }: EditCardProps<T>) => {
    const emptyItem = useMemo(() => {
        return fields.reduce((acc, item) => {
            const fullKey = item.subKey ? `${String(item.key)}.${item.subKey}` : String(item.key);
            const defaultValue = item.defaultValue || (item.type === 'multiselect' ? [] : '');

            lodash.set(acc, fullKey, defaultValue);

            return acc;
        }, {} as Partial<T>);
    }, [fields]);


    const [initialItem, setInitialItem] = useState<Partial<T> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [itemData, setItemData] = useState<Partial<T>>(emptyItem);
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
            setItemData(item);
        }
    }, [item, initialItem]);

    const handleSave = useCallback(async () => {
        if (!item) return;
        setLoading(true);
        try {
            const { data } = await saveItem<T>({ id, route, item: itemData as T, isFormData });
            const { status, message }: { status: string, message: string } = data as any;

            showToast({ message, type: status ? 'success' : 'danger' });
            onSave && onSave(status);
        } catch (error: AxiosError | any) {
            handleRequestError(error);
        } finally {
            setLoading(false);
            mutateProduct();
        }
    }, [itemData, id, item, mutateProduct, onSave, route, showToast]);

    const handleReset = useCallback(() => {
        if (initialItem) {
            setItemData(initialItem);
        }
        onCancel && onCancel();
    }, [initialItem, onCancel]);

    const handleInputChange = useCallback((key: string, type: InputType) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        let value: any = e.target.value;
        if (type === 'number') {
            value = Number(value);
        } else if (type === 'multiselect' && e.target instanceof HTMLSelectElement) {
            value = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) => option.value);
        }
        setItemData((prevItemData) => {
            const newItemData = lodash.cloneDeep(prevItemData);
            lodash.set(newItemData, key, value);
            return newItemData;
        });
    }, [itemData]);

    const renderFields = useMemo(() => initialItem && fields.map((field: EditTypeProps<T>) => {
        const fullKey = field.subKey ? `${String(field.key)}.${field.subKey}` : String(field.key);
        const value = lodash.get(itemData, fullKey) || field.defaultValue; 
    
        const inputProps = field.inputData && field.inputData.reduce((acc, { key, value, dataKey }) => {
                const v = dataKey ? lodash.get(itemData, dataKey as keyof T) : value;
                return { ...acc, [key]: v };
            }, {})

        return (
            <div className="edit-input" key={fullKey}>
                <EditField<T>
                    field={field}
                    value={value}
                    onChange={handleInputChange}
                    setItemData={setItemData}
                    {...inputProps && { inputProps }}
                />
            </div>
        );
      }), [fields, itemData, handleInputChange, setItemData, item, initialItem]);
    
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

            {renderFields}

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
