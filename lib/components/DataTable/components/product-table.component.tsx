"use client";
import React from 'react';
import { EditTypeProps, ProductProps } from '../../../interfaces';
import { useCategoryInputData, useExtraInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg, productVariantHeight, productVariantWidth } from '../../../constants';
import Table from "../../Table/components/table.component";
import { convertToProductDataProps, saveProduct } from 'lib/services';
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { showToast } = useToast();
    const { extraData } = useExtraInputData();

    const handleAction = async (item: ProductProps, action: string) => {
        const product = convertToProductDataProps(item);

        if(action === 'save') {
            const { data } = await saveProduct(product);
            const { status, message } = data;
            showToast({message, type: status ? 'success' : 'danger'});
            return status;
        }
    }
    
    const fields: EditTypeProps<ProductProps>[] = [
        {
            key: 'images',
            property: 'all',
            label: 'Resim',
            type: 'image',
            width: productVariantWidth,
            height: productVariantHeight,
            tableOrder: 0,
            render: (product: ProductProps) => (
                product.images && (
                    <div className="avatar">
                        {product.images.length > 0
                            ? <img draggable="false" src={imageToCdnUrl({ image: product.images[0]?.filename, type: 'table-avatar' })} />
                            : <img draggable="false" src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
                        }
                    </div>
                )
            ),
        },
        {
            key: 'order',
            property: 'view',
            label: 'Sıra',
            type: 'number',
            sort: true,
            editable: true,
            filterType: 'number',
        },
        {
            key: 'name',
            property: 'all',
            label: 'Ürün İsmi',
            type: 'text',
            sort: true,
            editable: true,
            required: true,
            filterType: 'text',
        },
        {
            key: 'category_id',
            property: 'all',
            label: 'Kategori',
            type: 'select',
            sort: true,
            editable: true,
            required: true,
            filterType: 'select',
            options: categories,
            render: (product: ProductProps) => (
                <span>{product.category?.name}</span>
            ),
        },
        {
            key: 'price',
            property: 'all',
            label: 'Fiyat',
            type: 'number',
            sort: true,
            editable: true,
            required: true,
            filterType: 'number',
            render: (product: ProductProps) => (
                <span>{product.price} ₺</span>
            ),
        },
        {
            key: 'extra',
            property: 'edit',
            label: 'Ekstra',
            type: 'multiselect',
            editable: true,
            options: extraData,
        },
        {
            key: 'description',
            property: 'edit',
            label: 'Açıklama',
            type: 'textarea',
            editable: true,
        },
        {
            key: 'recipe',
            property: 'edit',
            label: 'Tarif',
            type: 'textarea',
            editable: true,
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Düzenleme',
            type: 'date',
            sort: true,
            editable: false,
            defaultSort: 'DESC',
            filterType: 'date',
            render: (product: ProductProps) => (
                <span>{dateToString(product.updated_at, true)}</span>
            ),
        },
    ];

    return (
        <div className='table'>
            <Table<ProductProps>
                className="product-table"
                fields={fields}
                apiRoute="products"
                onAction={handleAction}
            />
        </div>
    );
};

export default ProductTable;
