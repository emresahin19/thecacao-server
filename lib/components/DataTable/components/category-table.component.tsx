"use client";
import React from 'react';
import { CardStyleProps, CategoryProps, EditTypeProps } from '../../../interfaces';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';
import { saveCategory } from 'lib/services';
import { defaultColor } from 'lib/constants';

const defaultStyle: CardStyleProps = {
    backgroundColor: '#dbf0fd',
    color: defaultColor,
    opacity: 0.2,
}

const CategoryTable: React.FC = () => {
    const { showToast } = useToast();

    const handleAction = async (item: CategoryProps, action: string) => {
        if(action === 'save') {
            const { data } = await saveCategory(item);
            const { status, message } = data;
            showToast({ message, type: status ? 'success' : 'danger' });
            return status;
        }
    }
    
    const fields: EditTypeProps<CategoryProps>[] = [
        {
            key: 'order',
            property: 'view', 
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
            subKey: 'backgroundColor',
            property: 'all',
            label: 'Arkaplan Rengi',
            type: 'color',
            editable: true,
            defaultValue: defaultStyle.backgroundColor,
            inputData: [
                {
                    key: 'style',
                    value: { backgroundColor: '#fff', borderRadius: 8 },
                },
                {
                    key: 'inputStyle',
                    dataKey: 'style',
                },
                {
                    key: 'labelColor',
                    dataKey: 'style.color',
                }
            ],
        },
        {
            key: 'style',
            subKey: 'color',
            property: 'all',
            label: 'Yazı Rengi',
            type: 'color',
            editable: true,
            defaultValue: defaultStyle.color,
            inputData: [
                {
                    key: 'labelColor',
                    dataKey: 'style.backgroundColor',
                }
            ],
        },
        {
            key: 'products',
            property: 'edit',
            label: 'Ürünler',
            type: 'sorter',
            inputData: [
                {
                    key: 'style',
                    dataKey: 'style',
                }
            ]
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Düzenleme',
            type: 'date',
            sort: true,
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
            defaultValue: defaultStyle.opacity,
            inputData: [
                {
                    key: 'min',
                    value: 0,
                },
                {
                    key: 'max',
                    value: 1,
                },
                {
                    key: 'step',
                    value: 0.1,
                },
            ],
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
