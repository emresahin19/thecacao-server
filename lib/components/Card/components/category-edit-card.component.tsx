import React, { useEffect, useState } from "react";
import Input from "../../Input/components/input.component";
import Button from "../../Button/components/button.component";
import Checkbox from "../../Input/components/checkbox.component";
import Spinner from "../../Loading/components/spinner.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import { useCategory } from "../../../hooks";
import { saveCategory } from '../../../services';
import { useToast } from "../../../contexts";
import { CategoryDataProps, CategoryEditProps } from "../card.props";
import RangeInput from "../../Input/components/range-input.component";
import { defaultColor } from "lib/constants";

const emptyCategory: CategoryDataProps = {
    id: 0,
    name: '',
    style: {
        backgroundColor: defaultColor,
        color: '#fff',
        opacity: 0.2,
    },
    order: 0,
    passive: 0,
};

const CategoryEdit: React.FC<CategoryEditProps> = ({ id, onSave, onCancel }) => {
    const [initialCategory, setInitialCategory] = useState<CategoryDataProps | null>(null);
    const [name, setName] = useState<string>('');
    const [order, setOrder] = useState<number>(0);
    const [passive, setPassive] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [style, setStyle] = useState<any>(emptyCategory.style);

    const { category, isError, isLoading, mutateCategory } = id ? useCategory(id) : { category: emptyCategory, isError: false, isLoading: false, mutateCategory: () => {} };
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
            setStyle(category.style);
            setOrder(category.order);
            setPassive(category.passive || 0);
        }
    }, [category, initialCategory]);

    const handleStyle = (key: string, value: any) => {
        setStyle((prevState: any) => ({...prevState, [key]: value}));
    };
        
    const handleSave = async () => {
        try {
            setLoading(true);
            const _category: CategoryDataProps = {
                id,
                name,
                style,
                order,
                passive,
            };
            const { data } = await saveCategory(_category);
            const { status, message, item } = data;

            showToast({message, type: status ? 'success' : 'danger'});
            onSave && onSave(status);
        } catch (error: any) {
            handleRequestError(error);
        } finally {
            mutateCategory();
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        if (initialCategory) {
            setName(initialCategory.name);
            setOrder(initialCategory.order);
            setPassive(initialCategory.passive || 0);
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
                    value={style.backgroundColor}
                    labelColor={style.color}
                    style={{ backgroundColor: '#fff', borderRadius: 8 }}
                    inputStyle={style}
                    onChange={(e) => handleStyle('backgroundColor', e.target.value)}
                />
            </div>

            <div className="edit-input">
                <Input
                    type="color"
                    name="textColor"
                    label="Yazı Rengi"
                    value={style.color}
                    labelColor={style.backgroundColor}
                    onChange={(e) => handleStyle('color', e.target.value)}
                />
            </div>

            <div className="edit-input">
                <RangeInput 
                    label="Opaklık"
                    value={style.opacity} 
                    min={0} 
                    max={1}
                    step={0.1}
                    onChange={(e) => handleStyle('opacity', e.target.value)}
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
                    loading={loading}
                >
                    Kaydet
                </Button>
            </div>
              
        </div>
    );
};

export default CategoryEdit;
