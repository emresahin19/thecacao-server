"use client";
import React from 'react';
import { CategoryProps, EditTypeProps } from '../../../interfaces';
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
    
    const fields: EditTypeProps<CategoryProps>[] = [
        {
            key: 'order',
            property: 'all', 
            label: 'Sıra',
            type: 'number',
            sort: true,
            editable: true,
            defaultSort: 'ASC',
            filterType: 'number',
        },
        {
            key: 'name',
            property: 'all',
            label: 'Kategori İsmi',
            type: 'text',
            sort: true,
            editable: true,
            filterType: 'text',
        },
        {
            key: 'style',
            subKey: 'color',
            property: 'all',
            label: 'Yazı Rengi',
            type: 'color',
            editable: true,
        },
        {
            key: 'style',
            subKey: 'backgroundColor',
            property: 'all',
            label: 'Arkaplan Rengi',
            type: 'color',
            editable: true,
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Düzenleme',
            type: 'date',
            sort: true,
            editable: false,
            filterType: 'date',
            render: (category: CategoryProps) => (
                <span>{category && category.updated_at && new Date(category.updated_at).toLocaleDateString()}</span>
            ),
        },
        {
            key: 'style',
            subKey: 'opacity',
            property: 'edit',
            label: 'Opaklık',
            type: 'range',
            inputData: {
                min: 0,
                max: 1,
                step: 0.1,
            },
            editable: true,
        },
    ];

    return (
        <div className='table'>
            <Table<CategoryProps>
                className="category-table"
                apiRoute="categories"
                onAction={handleAction}
                fields={fields}
            />
        </div>
    );
};

export default CategoryTable;
