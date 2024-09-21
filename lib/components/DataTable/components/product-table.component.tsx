"use client";
import React, { useEffect, useState } from 'react';
import { ProductProps } from '../../../interfaces';
import { useProducts } from '../../../hooks';
import { useCategoryInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';
import Table from "../../Table/components/table.component";
import Button from "../../Button/components/button.component";
import DeleteModal from "../../Modal/components/delete-modal.component";
import ProductEditCard from "../../Card/components/product-edit-card.component";
import { deleteProduct } from '../../../services';
import { useToast } from '../../../contexts';

const ProductTable = () => {
    const perPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const { products, total, isLoading, isError, mutateProduct } = useProducts(currentPage + 1, perPage, filters);
    const { categories } = useCategoryInputData();
    const { showToast, handleRequestError } = useToast();

    const handleFilterChange = (newFilters: { [key: string]: any }) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        if (isError) {
            handleRequestError(isError);
        }
    }, [isError]);

    const handleRowAction = (action: string, item: ProductProps | null) => {
        const { id, name } = item || { id: 0 };
        
        // if (action === 'view' || action === 'create') {
        //     handleShow({
        //         show: true,
        //         component: (
        //             <ProductEditCard 
        //                 id={id}
        //                 onSave={onProductSave} 
        //                 onCancel={onCancel} 
        //             />
        //         ),
        //     });
        // } else if (action === 'delete') {
        //     handleShow({
        //         show: true,
        //         component: (
        //             <DeleteModal
        //                 itemName={name}
        //                 onConfirm={() => handleDelete(id)} 
        //                 onCancel={onCancel}
        //             />
        //         ),
        //     });
        // }
    };

    const onProductSave = async (status: boolean) => {
        if(status){
            // handleShow({ show: false });
            mutateProduct();
        }
    };

    const handleDelete = async (id: number | string) => {
        try {
            const response = await deleteProduct(id);
            const { status, message } = response;
            showToast({ message, type: status ? 'success' : 'danger' });
        } catch (error) {
            handleRequestError(error);
        } finally {
            mutateProduct();
            // handleShow({ show: false });
        }
    };

    const onCancel = () => {
        // handleShow({ show: false });
    }

    return (
        <div className='table'>
            <Button
                onClick={() => handleRowAction('create', null)}
                label='Yeni Ürün Ekle'
            />
            <Table<ProductProps>
                data={products}
                className="product-table"
                columns={[
                    { 
                        key: 'images', 
                        label: 'Resim', 
                        render: (product: ProductProps) => (
                            product.images && (
                                <div className="avatar">
                                    {product.images.length > 0 &&
                                        <img src={`${product.images[0]?.url}`} />
                                    }
                                    {product.images.length === 0 &&
                                        <img src={imageToCdnUrl({image:placeholderProductImageBg, type: 'product'})} />
                                    }
                                </div>
                        ))
                    },
                    { 
                        key: 'name', 
                        label: 'Ürün İsmi', 
                        editable: true, 
                        filterType: 'text' 
                    },
                    { 
                        key: 'category', 
                        label: 'Kategori', 
                        editable: false, 
                        filterType: 'select', 
                        options: categories, 
                        render: (product: ProductProps) => (
                            <span>{product.category?.name}</span>
                        )
                    },
                    { 
                        key: 'price', 
                        label: 'Fiyat', 
                        editable: true, 
                        filterType: 'number' 
                    },
                    { 
                        key: 'updatedAt', 
                        label: 'Son Düzenleme', 
                        editable: true, 
                        filterType: 'date', 
                        render: (product: ProductProps) => (
                            <span>{dateToString(product.updatedAt, true)}</span>
                        )
                    }
                ]}
                onRowAction={handleRowAction}
                onPageChange={setCurrentPage}
                onFilterChange={handleFilterChange}
                currentPage={currentPage}
                perPage={perPage}
                totalItems={total}
                loading={isLoading}
            />
        </div>
    );
};

export default ProductTable;
