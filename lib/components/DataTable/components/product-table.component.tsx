"use client";
import React from 'react';
import { ProductProps } from '../../../interfaces';
import { useProducts } from '../../../hooks';
import { useCategoryInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';
import Table from "../../Table/components/table.component";

const ProductTable = () => {
    const { categories } = useCategoryInputData();

    return (
        <div className='table'>
            <Table<ProductProps>
                className="product-table"
                dataHook={useProducts}
                editPage="ProductEditCard"
                apiRoute="products"
                columns={[
                    {
                        key: 'images',
                        label: 'Resim',
                        render: (product: ProductProps) => (
                            product.images && (
                                <div className="avatar">
                                    {product.images.length > 0
                                        ? <img src={imageToCdnUrl({ image: product.images[0]?.filename, type: 'table-avatar' })} />
                                        : <img src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
                                    }
                                </div>
                            ))
                    },
                    {
                        key: 'name',
                        label: 'Ürün İsmi',
                        sort: true,
                        editable: true,
                        filterType: 'text'
                    },
                    {
                        key: 'category_id',
                        label: 'Kategori',
                        sort: true,
                        editable: true,
                        filterType: 'select',
                        options: categories,
                        render: (product: ProductProps) => (
                            <span>{product.category?.name}</span>
                        )
                    },
                    {
                        key: 'price',
                        sort: true,
                        label: 'Fiyat',
                        editable: true,
                        filterType: 'number'
                    },
                    {
                        key: 'updated_at',
                        label: 'Son Düzenleme',
                        sort: true,
                        editable: true,
                        filterType: 'date',
                        render: (product: ProductProps) => (
                            <span>{dateToString(product.updated_at, true)}</span>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default ProductTable;
