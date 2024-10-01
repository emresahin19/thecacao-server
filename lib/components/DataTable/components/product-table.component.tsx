"use client";
import React from 'react';
import { ProductProps } from '../../../interfaces';
import { useProducts } from '../../../hooks';
import { useCategoryInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';
import Table from "../../Table/components/table.component";
import { convertToProductDataProps, saveProduct } from 'lib/services';
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { showToast } = useToast();

    const handleAction = async (item: ProductProps, action: string) => {
        const product = convertToProductDataProps(item);

        if(action === 'save') {
            const { data } = await saveProduct(product);
            const { status, message } = data;
            showToast({message, type: status ? 'success' : 'danger'});
            return status;
        }
    }

    return (
        <div className='table'>
            <Table<ProductProps>
                className="product-table"
                dataHook={useProducts}
                editPage="ProductEditCard"
                apiRoute="products"
                onAction={handleAction}
                columns={[
                    {
                        key: 'order',
                        label: 'Sıra',
                        sort: true,
                        editable: true,
                        filterType: 'number'
                    },
                    {
                        key: 'images',
                        label: 'Resim',
                        render: (product: ProductProps) => (
                            product.images && (
                                <div className="avatar">
                                    {product.images.length > 0
                                        ? <img draggable="false" src={imageToCdnUrl({ image: product.images[0]?.filename, type: 'table-avatar' })} />
                                        : <img draggable="false" src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
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
