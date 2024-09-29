import React, { useEffect, useState } from "react";
import Input from "../../Input/components/input.component";
import Button from "../../Button/components/button.component";
import Checkbox from "../../Input/components/checkbox.component";
import Spinner from "../../Loading/components/spinner.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import MultipleImageInput from "../../Input/components/multiple-image-input.component";
import MultipleSelectBox from "../../Input/components/multiple-selectbox.component";

import { useCategoryInputData, useExtraInputData, useProduct, useProducts } from "../../../hooks";
import { ImageObject } from "../../../interfaces";
import { useLoading, useToast } from "../../../contexts";
import { saveProduct } from '../../../services';
import { AxiosError } from "axios";
import { ProductDataProps, ProductEditProps } from "../card.props";
import { productVariantHeight, productVariantWidth } from "lib/constants";
import { useRouter } from "next/router";

const emptyProduct: ProductDataProps = {
    id: 0,
    category_id: 0,
    name: '',
    price: 0,
    recipe: '',
    description: '',
    images: [],
    extra: [],
    passive: 0,
};

const ProductEdit: React.FC<ProductEditProps> = ({ id, onSave, onCancel }) => {
    const [initialProduct, setInitialProduct] = useState<ProductDataProps | null>(null);
    const [category_id, setCategoryId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [recipe, setRecipe] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [passive, setPassive] = useState<number>(0);
    const [images, setImages] = useState<ImageObject[]>([]);
    const [extra, setExtra] = useState<number[]>([]);

    const { categories } = useCategoryInputData();
    const { extraData } = useExtraInputData();
    const { product, isError, isLoading, mutateProduct } = id ? useProduct(id) : { product: emptyProduct, isError: false, isLoading: false, mutateProduct: () => {} };
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
        setLoading(true);
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
            onSave && onSave(item);
        } catch (error: AxiosError | any) {
            handleRequestError(error);
        } finally {
            setLoading(false);
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
            <div className="modal-custom-header">
                <h3>{id === 0 ? 'Yeni Ürün Ekle' : `${name} Düzenle`}</h3>

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
                <MultipleSelectBox
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
                    width={productVariantWidth}
                    height={productVariantHeight}
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
                    loading={loading}
                    color2="success"
                >
                    Kaydet
                </Button>
            </div>
              
        </div>
    );
};

export default ProductEdit;
