import React, { useEffect, useState } from "react";
import { Input, SelectBox, Button, DashDivider, Checkbox, MultipleImageInput, MultipleSelectBox, Spinner } from "@asim-ui/components";
import { useCategoryInputData } from "@asim-ui/hooks";
import { ImageObject } from "@asim-ui/interfaces";
import { useExtraInputData } from "@asim-ui/hooks";
import { useLoading } from "@asim-ui/contexts";
import { useProduct } from "@asim-ui/hooks";
import { saveProduct } from '@asim-ui/services';
import { useToast } from "@asim-ui/contexts";
import { AxiosError } from "axios";
import { ProductDataProps, ProductEditProps } from "../card.props";

const ProductEdit: React.FC<ProductEditProps> = ({ id, onSave, onCancel }) => {
    const [initialProduct, setInitialProduct] = useState<ProductDataProps | null>(null);
    const [category_id, setCategoryId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [recipe, setRecipe] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [passive, setPassive] = useState<number>(0);
    const [images, setImages] = useState<ImageObject[]>([]);
    const [extra, setExtra] = useState<number[]>([]);

    const { categories } = useCategoryInputData();
    const { extraData } = useExtraInputData();
    const { loaded, setLoaded } = useLoading();
    const { product, isError, isLoading, mutateProduct } = useProduct(id);
    const { showToast, handleRequestError } = useToast();

    useEffect(() => {
        if (isError) {
            showToast({message: 'Ürün bilgileri alınamadı.', type: 'danger'});
        }
    }, [isError]);
    
    useEffect(() => {
        if (product && !initialProduct) {
            setInitialProduct(product);
            setCategoryId(product.category_id);
            setName(product.name);
            setPrice(product.price);
            setRecipe(product.recipe || '');
            setDescription(product.description || '');
            setPassive(product.passive || 0);
            setImages(product.images || []);
            setExtra(product.extra ? product.extra.map(Number) : []);
        }
    }, [product, initialProduct]);

    const handleSave = async () => {
        setLoaded(true);
        try {
            const _product: ProductDataProps = {
                id,
                category_id,
                name,
                price,
                recipe,
                description,
                images,
                extra,
                passive,
            };
            const response = await saveProduct(_product);
            const { status, message, item } = response;

            showToast({message, type: status ? 'success' : 'danger'});
            onSave && onSave(status);
        } catch (error: AxiosError | any) {
            handleRequestError(error);
        } finally {
            setLoaded(false);
            mutateProduct();
        }
    };
    
    const handleReset = () => {
        if (initialProduct) {
            setCategoryId(initialProduct.category_id);
            setName(initialProduct.name);
            setPrice(initialProduct.price);
            setRecipe(initialProduct.recipe || '');
            setDescription(initialProduct.description || '');
            setPassive(initialProduct.passive || 0);
            setImages(initialProduct.images || []);
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
            <h3>{id === 0 ? 'Yeni Ürün Ekle' : `${name} Düzenle`}</h3>

            <DashDivider />

            <div className="edit-input">
                <Input
                    type="text"
                    name="name"
                    label="Ürün İsmi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="edit-input">
                <SelectBox
                    name="category_id"
                    label="Kategori"
                    options={categories}
                    value={category_id}
                    onChange={(e: any) => setCategoryId(Number(e.target.value))}
                />
            </div>
            <div className="edit-input">
                <Input
                    type="number"
                    name="price"
                    label="Fiyat"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </div>
            <div className="edit-input">
                <Input
                    type="textarea"
                    name="description"
                    label="Açıklama"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="edit-input">
                <Input
                    type="textarea"
                    name="recipe"
                    label="Tarif"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                />
            </div>
            <div className="edit-input">
                <MultipleSelectBox
                    name="extra"
                    label="Ekstra"
                    options={extraData}
                    value={extra}
                    onChange={(e: any) => setExtra(e.target.value)}
                />
            </div>
            <div className="edit-input">
                <MultipleImageInput
                    initialImages={images}
                    onImagesChange={setImages}
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
                    loading={loaded}
                    color2="success"
                >
                    Kaydet
                </Button>
            </div>
              
        </div>
    );
};

export default ProductEdit;
