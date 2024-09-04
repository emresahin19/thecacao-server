import React, { useEffect, useState } from "react";
import { Input, Button, DashDivider, Checkbox, Spinner, CategoryEditProps } from "@asim-ui/components";
import { useCategory } from "@asim-ui/hooks";
import { saveCategory } from '@asim-ui/services';
import { useToast } from "@asim-ui/contexts";
import { AxiosError } from "axios";
import { CategoryDataProps } from "../card.props";

const CategoryEdit: React.FC<CategoryEditProps> = ({ id, onSave, onCancel }) => {
    const [initialCategory, setInitialCategory] = useState<CategoryDataProps | null>(null);
    const [name, setName] = useState<string>('');
    const [order, setOrder] = useState<number>(0);
    const [passive, setPassive] = useState<number>(0);
    const [color, setColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');

    const { category, isError, isLoading, mutateCategory } = useCategory(id);
    const { showToast, handleRequestError } = useToast();

    useEffect(() => {
        if (isError) {
            showToast({message: 'Kategori bilgileri alınamadı.', type: 'danger'});
        }
    }, [isError]);
    
    useEffect(() => {
        if (category && !initialCategory) {
            setInitialCategory(category);
            setName(category.name);
            setOrder(category.order);
            setPassive(category.passive || 0);
            setColor(category.color || '');
            setTextColor(category.textColor || '');
        }
    }, [category, initialCategory]);

    const handleSave = async () => {
        try {
            const _category: CategoryDataProps = {
                id,
                name,
                order,
                passive,
                color,
                textColor,
            };
            const response = await saveCategory(_category);
            const { status, message } = response;

            showToast({message, type: status ? 'success' : 'danger'});
            onSave && onSave(status);
        } catch (error: AxiosError | any) {
            handleRequestError(error);
        } finally {
            mutateCategory();
        }
    };
    
    const handleReset = () => {
        if (initialCategory) {
            setName(initialCategory.name);
            setOrder(initialCategory.order);
            setPassive(initialCategory.passive || 0);
            setColor(initialCategory.color || '');
            setTextColor(initialCategory.textColor || '');
        }
        onCancel && onCancel();
    };

    if(isLoading){
        return (
            <div className="edit-section modal-loading">
                <Spinner absolute={true} />
            </div>
        )
    }
    
    return (
        <div className="edit-section">
            <h3>{id === 0 ? 'Yeni Kategori Ekle' : `${name} Düzenle`}</h3>

            <DashDivider />

            <div className="edit-input">
                <Input
                    type="text"
                    name="name"
                    label="Kategori İsmi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="edit-input">
                <Input
                    type="number"
                    name="order"
                    label="Sıra"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                />
            </div>
            
            <div className="edit-input">
                <Input
                    type="color"
                    name="color"
                    label="Arkaplan Rengi"
                    value={color}
                    labelColor={textColor}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>

            <div className="edit-input">
                <Input
                    type="color"
                    name="textColor"
                    label="Yazı Rengi"
                    value={textColor}
                    labelColor={color}
                    onChange={(e) => setTextColor(e.target.value)}
                />
            </div>

            <div className="edit-input">
                <Checkbox
                    id="passive"
                    name="passive"
                    label="Pasif"
                    checked={passive === 1}
                    onChange={() => setPassive(passive === 1 ? 0 : 1)}
                />
            </div>
            
            <div className="edit-input button-area">
                <Button 
                    onClick={handleReset}
                    color2="danger"
                >
                    İptal
                </Button>
                
                <Button 
                    property="reverse" 
                    onClick={handleSave}
                    color2="success"
                >
                    Kaydet
                </Button>
            </div>
              
        </div>
    );
};

export default CategoryEdit;
