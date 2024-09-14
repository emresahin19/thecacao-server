"use client";
import React, { useEffect, useState } from 'react';
import { CategoryProps } from '../../../interfaces';
import { useToast, useModal } from '../../../contexts';
import { useCategories } from '../../../hooks';

import Table from "../../Table/components/table.component";
import Button from "../../Button/components/button.component";
import DeleteModal from "../../Modal/components/delete-modal.component";
import CategoryEditCard from "../../Card/components/category-edit-card.component";

import { deleteCategory } from '../../../services';

const CategoryTable = () => {
    const perPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const { categories, total, isLoading, isError, mutateCategories } = useCategories(currentPage + 1, perPage, filters);
    const { handleShow } = useModal();
    const { showToast, handleRequestError } = useToast();

    const handleFilterChange = (newFilters: { [key: string]: any }) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        if (isError) {
            handleRequestError(isError);
        }
    }, [isError]);

    const handleRowAction = (action: string, item: CategoryProps | null) => {
        const { id, name } = item || { id: 0 };
        
        if (action === 'view' || action === 'create') {
            handleShow({
                show: true,
                component: (
                    <CategoryEditCard 
                        id={id}
                        onSave={onCategorySave} 
                        onCancel={onCancel} 
                    />
                ),
            });
        } else if (action === 'delete') {
            handleShow({
                show: true,
                component: (
                    <DeleteModal
                        itemName={name}
                        onConfirm={() => handleDelete(id)} 
                        onCancel={onCancel}
                    />
                ),
            });
        }
    };

    const onCategorySave = async (status: boolean) => {
        if (status) {
            handleShow({ show: false });
            mutateCategories();
        }
    };

    const handleDelete = async (id: number | string) => {
        try {
            const response = await deleteCategory(id);
            const { status, message } = response;
            showToast({ message, type: status ? 'success' : 'danger' });
        } catch (error) {
            handleRequestError(error);
        } finally {
            mutateCategories();
            handleShow({ show: false });
        }
    };

    const onCancel = () => {
        handleShow({ show: false });
    };

    return (
        <div className='table'>
            <Button
                onClick={() => handleRowAction('create', null)}
                label='Yeni Kategori Ekle'
            />
            <Table<CategoryProps>
                data={categories}
                className="category-table"
                columns={[
                    { 
                        key: 'name', 
                        label: 'Kategori İsmi', 
                        editable: true, 
                        filterType: 'text' 
                    },
                    { 
                        key: 'order', 
                        label: 'Sıra', 
                        editable: true, 
                        filterType: 'number' 
                    },
                    {
                        key: 'color',
                        label: 'Arkaplan',
                        editable: false,
                        type: 'color',
                    },
                    {
                        key: 'textColor',
                        label: 'Yazı',
                        editable: false,
                        type: 'color',
                    },
                    { 
                        key: 'updatedAt', 
                        label: 'Son Düzenleme', 
                        editable: true, 
                        filterType: 'date', 
                        render: (category: CategoryProps) => (
                            <span>{category && category.updatedAt && new Date(category.updatedAt).toLocaleDateString()}</span>
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

export default CategoryTable;
