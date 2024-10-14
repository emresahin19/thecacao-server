"use client";
import React from 'react';
import Table from "../../Table/components/table.component";
import { EditTypeProps, OptionsProps, ProductProps } from '../../../interfaces';
import { useCategoryInputData, useExtraInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { extraData } = useExtraInputData();

    const fields: EditTypeProps<ProductProps>[] = [
        {
            key: 'images',
            property: 'all',
            label: 'Resim',
            type: 'images',
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
            options: extraData.filter((extra: OptionsProps) => extra.options && extra.options.length > 0),
            defaultValue: [],
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
                dateToString(product.updated_at, false) as React.ReactNode
            ),
        },
    ];

    return (
        <div className='table'>
            <Table<ProductProps>
                className="product-table"
                apiRoute="products"
                fields={fields}
                isFormData={true}
            />
        </div>
    );
};

export default ProductTable;
