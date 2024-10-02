"use client";
import React from 'react';
import { CategoryProps } from '../../../interfaces';
import { useCategories } from '../../../hooks';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';
import { saveCategory } from 'lib/services';

const CategoryTable: React.FC = () => {
    const { showToast } = useToast();

    const handleAction = async (item: CategoryProps, action: string) => {
        if(action === 'save') {
            const { data } = await saveCategory(item);
            const { status, message } = data;
            showToast({message, type: status ? 'success' : 'danger'});
            return status;
        }
    }

    return (
        <div className='table'>
            <Table<CategoryProps>
                className="category-table"
                dataHook={useCategories}
                editPage="CategoryEditCard"
                apiRoute="categories"
                onAction={handleAction}
                columns={[
                    { 
                        key: 'order', 
                        label: 'Sıra', 
                        editable: true, 
                        sort: true,
                        defaultSort: 'ASC',
                        filterType: 'number' 
                    },
                    { 
                        key: 'name', 
                        label: 'Kategori İsmi', 
                        editable: true, 
                        sort: true,
                        filterType: 'text' 
                    },
                    {
                        key: 'color',
                        label: 'Arkaplan',
                        editable: true,
                        type: 'color',
                    },
                    {
                        key: 'textColor',
                        label: 'Yazı',
                        editable: true,
                        type: 'color',
                    },
                    { 
                        key: 'updated_at', 
                        label: 'Son Düzenleme', 
                        sort: true,
                        editable: true, 
                        filterType: 'date', 
                        render: (category: CategoryProps) => (
                            <span>{category && category.updated_at && new Date(category.updated_at).toLocaleDateString()}</span>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default CategoryTable;
